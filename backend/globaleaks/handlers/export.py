# -*- coding: utf-8 -*-
#
# export
# *****
#
# Tip export utils
import copy

from twisted.internet import threads
from twisted.internet.defer import inlineCallbacks

from globaleaks import models
from globaleaks.orm import transact, transact_ro
from globaleaks.handlers.admin.context import admin_serialize_context
from globaleaks.handlers.admin.node import db_admin_serialize_node
from globaleaks.handlers.admin.notification import db_get_notification
from globaleaks.handlers.admin.receiver import admin_serialize_receiver
from globaleaks.handlers.base import BaseHandler
from globaleaks.handlers.files import serialize_receiver_file
from globaleaks.handlers.rtip import db_access_rtip, serialize_rtip, \
    db_get_comment_list, db_get_message_list
from globaleaks.handlers.submission import get_submission_sequence_number
from globaleaks.models import ReceiverFile
from globaleaks.rest import errors
from globaleaks.settings import GLSettings
from globaleaks.utils.templating import Templating
from globaleaks.utils.zipstream import ZipStream
from globaleaks.utils.utility import deferred_sleep


@transact_ro
def get_tip_export(store, user_id, rtip_id, language):
    rtip = db_access_rtip(store, user_id, rtip_id)

    receiver = rtip.receiver

    export_dict = {
        'type': u'export_template',
        'node': db_admin_serialize_node(store, language),
        'notification': db_get_notification(store, language),
        'tip': serialize_rtip(store, rtip, language),
        'context': admin_serialize_context(store, rtip.internaltip.context, language),
        'receiver': admin_serialize_receiver(receiver, language),
        'comments': db_get_comment_list(rtip),
        'messages': db_get_message_list(rtip),
        'files': []
    }

    export_template = Templating().format_template(export_dict['notification']['export_template'], export_dict).encode('utf-8')

    export_dict['files'].append({'buf': export_template, 'name': "data.txt"})

    for rf in store.find(models.ReceiverFile, models.ReceiverFile.receivertip_id == rtip_id):
        rf.downloads += 1
        file_dict = serialize_receiver_file(rf)
        file_dict['name'] = 'files/' + file_dict['name']
        export_dict['files'].append(copy.deepcopy(file_dict))

    return export_dict


class ExportHandler(BaseHandler):
    handler_exec_time_threshold = 3600

    @BaseHandler.transport_security_check('receiver')
    @BaseHandler.authenticated('receiver')
    @inlineCallbacks
    def get(self, rtip_id):
        tip_export = yield get_tip_export(self.current_user.user_id, rtip_id, self.request.language)

        self.set_header('X-Download-Options', 'noopen')
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=\"%s.zip\"' % tip_export['tip']['sequence_number'])

        self.zip_stream = iter(ZipStream(tip_export['files']))

        def zip_chunk():
            chunk = []
            chunk_size = 0

            for data in self.zip_stream:
                if len(data):
                    chunk_size += len(data)
                    chunk.append(data)
                    if chunk_size >= GLSettings.file_chunk_size:
                        return ''.join(chunk)

            return ''.join(chunk)

        chunk = yield threads.deferToThread(zip_chunk)
        while len(chunk):
            self.write(chunk)
            self.flush()
            yield deferred_sleep(0.01)
            chunk = yield threads.deferToThread(zip_chunk)
