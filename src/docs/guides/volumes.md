---
title: Using Volumes
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

The volume mount point you specify will be available in your service as a
directory you can read/write to. For instance, if you mount a volume to
`/foobar`, your application will be able to access it at `/foobar`.

Attaching a Volume to a service will make these environment variables available
to the service:
- `RAILWAY_VOLUME_NAME`: Name of the volume (e.g. `foobar`)
- `RAILWAY_VOLUME_MOUNT_PATH`: Mount path of the volume (e.g. `/foobar`)

