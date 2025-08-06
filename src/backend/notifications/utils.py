from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_notification(message, group):
    channel_layer = get_channel_layer()
    message = {
        'type': 'notification_message',
        'message': message
    }

    async_to_sync(channel_layer.group_send)(group, message)

def send_profile_update(message, profile_id):
    channel_layer = get_channel_layer()
    message = {
        'type': 'profile_message',
        'message': message
    }

    async_to_sync(channel_layer.group_send)(f"profile_{profile_id}", message)