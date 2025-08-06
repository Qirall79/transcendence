import json
from rest_framework.response import Response
from rest_framework.decorators import api_view

from authentication import serializers
from friendships.services import friends_service

@api_view(["GET", "POST", "DELETE"])
def friends_controller(request):
    user = request.user
    serializer = serializers.FriendSerializer(user.friends, many=True)
    if request.method == "GET":
        return Response(serializer.data, status=200)
    if request.method == "POST":
        return friends_service.add_friend(request)
    if request.method == "DELETE":
        return friends_service.remove_friend(request)


@api_view(["GET", "POST", "DELETE"])
def invites_controller(request):
    user = request.user
    serializer = serializers.MiniUserSerializer(user.invited_by, many=True)
    if request.method == "GET":
        return Response(serializer.data, status=200)
    if request.method == "POST":
        return friends_service.invite_user(request)
    if request.method == "DELETE":
        return friends_service.delete_invite(request)


@api_view(["GET", "POST", "DELETE"])
def blocks_controller(request):
    user = request.user
    serializer = serializers.MiniUserSerializer(user.blocked_users, many=True)
    if request.method == "GET":
        return Response(serializer.data, status=200)
    if request.method == "POST":
        return friends_service.block_user(request)
    if request.method == "DELETE":
        return friends_service.unblock_user(request)
