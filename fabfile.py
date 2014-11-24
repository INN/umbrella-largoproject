import os

from tools.fablib import *
from fabric.api import task

"""
Base configuration
"""
env.project_name = 'largoproject'

try:
    env.hipchat_token = os.environ['HIPCHAT_DEPLOYMENT_NOTIFICATION_TOKEN']
    env.hipchat_room_id = os.environ['HIPCHAT_DEPLOYMENT_NOTIFICATION_ROOM_ID']
except KeyError:
    pass


# Environments
@task
def production():
    """
    Work on production environment
    """
    env.settings = 'production'
    env.hosts = [os.environ['LARGOPROJECT_PRODUCTION_SFTP_HOST'], ]
    env.user = os.environ['LARGOPROJECT_PRODUCTION_SFTP_USER']
    env.password = os.environ['LARGOPROJECT_PRODUCTION_SFTP_PASSWORD']


@task
def staging():
    """
    Work on staging environment
    """
    env.settings = 'staging'
    env.hosts = [os.environ['LARGOPROJECT_STAGING_SFTP_HOST'], ]
    env.user = os.environ['LARGOPROJECT_STAGING_SFTP_USER']
    env.password = os.environ['LARGOPROJECT_STAGING_SFTP_PASSWORD']


try:
    from local_fabfile import  *
except ImportError:
    pass
