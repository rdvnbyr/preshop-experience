# Backups Directory

This directory contains database backups created by the Docker management script.

## Backup Files
- Backups are created in MongoDB archive format with gzip compression
- Naming convention: `backup_YYYYMMDD_HHMMSS.archive`
- Retention: Recommended to keep backups for 30 days

## Usage

### Create a backup
```bash
./docker-manager.sh backup
```

### Restore from backup
```bash
./docker-manager.sh restore backup_20231009_143022.archive
```

### Manual cleanup
Old backup files should be removed manually or with a cron job:
```bash
find ./backups -name "backup_*.archive" -mtime +30 -delete
```