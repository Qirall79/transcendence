from django.db import models
from django.conf import settings
from django.utils import timezone
from asgiref.sync import sync_to_async 

# Create your models here.

class Conversation(models.Model):
    user_1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_conversations')
    user_2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_conversations')
    modified_date = models.DateTimeField(auto_now=True) 
    
    def __str__(self):
        return f"Conversation between {self.user_1} and {self.user_2}"

    class Meta:
        unique_together = ('user_1', 'user_2')




class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    conversation = models.ForeignKey('Conversation', on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    is_readed = models.BooleanField(default=False)
    send_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message from {self.sender} in conversation {self.conversation.id}"




async def create_message(sender, conversation, content, is_readed=False):
    
    
    new_message = Message(
        sender=sender,
        conversation=conversation,
        content=content,
        is_readed=is_readed,
        send_date=timezone.now() 
    )

    conversation.modified_date = timezone.now()

    await sync_to_async(new_message.save)()
    await sync_to_async(conversation.save)()

    return new_message



def get_last_message(conversation_id):
    try:
        last_message = Message.objects.filter(conversation=conversation_id).order_by('-send_date').first()
        
        return last_message.content if last_message else ""
    except Exception:
        return ""