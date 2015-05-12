import os

from tools.fablib import *
from fabric.api import task

"""
Base configurations, override domain in your own local_fabfile.py
"""
env.project_name = 'largoproject'
env.local_db_user = 'root';

try:
    env.domain
except AttributeError:
    env.domain = 'vagrant.dev'

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
    env.domain = 'largoproject.wpengine.com'
    env.port = 2222


@task
def staging():
    """
    Work on staging environment
    """
    env.settings = 'staging'
    env.hosts = [os.environ['LARGOPROJECT_STAGING_SFTP_HOST'], ]
    env.user = os.environ['LARGOPROJECT_STAGING_SFTP_USER']
    env.password = os.environ['LARGOPROJECT_STAGING_SFTP_PASSWORD']
    env.domain = 'largoproject.staging.wpengine.com'
    env.port = 2222


try:
    from local_fabfile import  *
except ImportError:
    pass
