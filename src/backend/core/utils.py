import core.settings as settings

def read_secret(path, key):
    return settings.VAULT_CLIENT.secrets.kv.v2.read_secret_version(
        path=path,
        mount_point=settings.VAULT_MOUNTPOINT
    )['data']['data'][key]