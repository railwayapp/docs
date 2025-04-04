---
title: Using Volumes
description: Use volumes on Railway to securely store and persist your data permanently.
---

Volumes allow you to store persistent data for services on Railway.

<Image
    layout="intrinsic"
    quality={100}
    width={574}
    height={454}
    src="https://res.cloudinary.com/railway/image/upload/v1687540596/docs/volumes/volumes_su6dly.png"
    alt="Volume"
/>

## Creating A Volume

You can create a new volume through the Command Palette (`⌘K`)
or by right-clicking the project canvas to bring up a menu:
<div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
    <div>
        <Image
            layout="intrinsic"
            quality={100}
            width={1118}
            height={476}
            src="https://res.cloudinary.com/railway/image/upload/v1687539860/docs/volumes/creating-volume-cmdk_w3wsv1.png"
            alt="Creating a volume via command palette"
        />
        <p style={{ marginTop: '-0.2em', fontSize: '0.8em', opacity: '0.6' }}>via command palette</p>
    </div>
    <div>
        <Image
            layout="intrinsic"
            quality={100}
            width={582}
            height={476}
            src="https://res.cloudinary.com/railway/image/upload/v1687539860/docs/volumes/creating-volume-menu_lqax4n.png"
            alt="Creating a volume via context menu"
        />
        <p style={{ marginTop: '-0.2em', fontSize: '0.8em', opacity: '0.6' }}>via right-click menu</p>
    </div>
</div>

When creating a volume, you will be prompted to select a service to connect the volume to:
<Image
    layout="intrinsic"
    quality={100}
    width={1148}
    height={524}
    src="https://res.cloudinary.com/railway/image/upload/v1687542048/docs/volumes/connect-volume-to-service_ao4s5h.png"
    alt="Connect volume to service"
/>

You must configure the mount path of the volume in your service:
<Image
    layout="intrinsic"
    quality={100}
    width={1136}
    height={400}
    src="https://res.cloudinary.com/railway/image/upload/v1687542048/docs/volumes/mount-point_kedfak.png"
    alt="Connect volume to service"
/>

## Using the Volume

The volume mount point you specify will be available in your service as a directory to which you can read/write.  If you mount a volume to `/foobar`, your application will be able to access it at the absolute path `/foobar`.

### Relative Paths

Nixpacks, the default buildpack used by Railway, puts your application files in an `/app` folder at the root of the container.  If your application writes to a directory at a relative path, and you need to persist that data on the volume, your mount path should include the app path.

For example, if your application writes data to `./data`, you should mount the volume to `/app/data`.

### Provided Variables

Attaching a Volume to a service will automatically make these environment variables available
to the service at runtime:
- `RAILWAY_VOLUME_NAME`: Name of the volume (e.g. `foobar`)
- `RAILWAY_VOLUME_MOUNT_PATH`: Mount path of the volume (e.g. `/foobar`)

You do not need to define these variables on the service, they are automatically set by Railway at runtime.

### Volume Availability

Volumes are mounted to your service's container when it is started, not during build time.

If you write data to a directory at build time, it will not persist on the volume, even if it writes to the directory to which you have mounted the volume.

**Note:** Volumes are not mounted during pre-deploy time, if your pre-deploy command attempts to read or write data to a volume, it should be done as part of the start command.

Volumes are not mounted as overlays.

### Permissions

Volumes are mounted as the `root` user.  If you run an image that uses a non-root user, you should set the following variable on your service:
```
RAILWAY_RUN_UID=0
```

## Growing the Volume

***Only available to Pro users and above.***

To increase capacity in a volume, you can "grow" it from the volume settings.
- Click on the volume to open the settings
- Click `Grow`
- Follow the prompts to grow the volume

<Image
    layout="intrinsic"
    quality={100}
    width={1148}
    height={584}
    src="https://res.cloudinary.com/railway/image/upload/v1730326473/docs/volumes/growvolume_zbsjjq.png"
    alt="Grow volume"
/>

Note: growing a volume requires a restart of the attached service.

## Backups

Services with volumes support manual and automated backups, backups are covered in the [backups](/reference/backups) reference guide.