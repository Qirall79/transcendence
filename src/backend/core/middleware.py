import traceback
from django.http import JsonResponse
from django.conf import settings
from channels.middleware import BaseMiddleware
from channels.exceptions import StopConsumer


class GlobalExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        error_message = str(exception)
        error_traceback = traceback.format_exc()

        response_data = {
            'error': 'something went wrong !',
            'detail': error_traceback if settings.DEBUG else "Please re-check the path and body of your request"
        }

        return JsonResponse(response_data, status=400)


class WebSocketExceptionMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            return await super().__call__(scope, receive, send)
        except StopConsumer:
            raise
        except Exception as e:
            if scope["type"] == "websocket":
                try:
                    await send({
                        "type": "websocket.close",
                        "code": 1011,
                    })
                except Exception:
                    pass
