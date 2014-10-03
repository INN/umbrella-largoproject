import os

from tools.fablib import *

"""
Base configuration
"""
env.project_name = 'largoproject'
env.file_path = '.'

try:
    env.hipchat_token = os.environ['HIPCHAT_DEPLOYMENT_NOTIFICATION_TOKEN']
    env.hipchat_room_id = os.environ['HIPCHAT_DEPLOYMENT_NOTIFICATION_ROOM_ID']
except KeyError:
    pass


# Environments
def production():
    """
    Work on production environment
    """
    env.settings = 'production'
    env.hosts = [os.environ['LARGOPROJECT_PRODUCTION_SFTP_HOST'], ]
    env.user = os.environ['LARGOPROJECT_PRODUCTION_SFTP_USER']
    env.password = os.environ['LARGOPROJECT_PRODUCTION_SFTP_PASSWORD']


def staging():
    """
    Work on staging environment
    """
    env.settings = 'staging'
    env.hosts = [os.environ['LARGOPROJECT_STAGING_SFTP_HOST'], ]
    env.user = os.environ['LARGOPROJECT_STAGING_SFTP_USER']
    env.password = os.environ['LARGOPROJECT_STAGING_SFTP_PASSWORD']

def vagrant():
    """
    Work on vagrant (dev) environment
    """
    env.user = 'vagrant'
    env.hosts = ['127.0.0.1:2222']
    env.path = '/vagrant/'
    result = local('vagrant ssh-config | grep IdentityFile', capture=True)
    env.key_filename = result.split()[1]

try:
    from local_fabfile import  *
except ImportError:
    pass
