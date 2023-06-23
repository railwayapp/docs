---
title: Volumes
---

<PriorityBoardingBanner />

Volumes is a feature that allows you to store persistent data for services on Railway.

<Image
    layout="intrinsic"
    quality={100}
    width={824}
    height={654}
    src="https://res.cloudinary.com/railway/image/upload/v1687540596/docs/volumes/volumes_su6dly.png"
    alt="Volume"
/>

## Creating A Volume

You can create a new volume through the Command Palette (`⌘K`)
or by right-clicking the project canvas to bring up a menu.

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

When creating a new volume, you can pick the size of the volume:

<Image
    layout="intrinsic"
    quality={100}
    width={1088}
    height={656}
    src="https://res.cloudinary.com/railway/image/upload/v1687541236/docs/volumes/volume-size-picker_vdsmmk.png"
    alt="Volume size picker"
/>

A volume must be connected to a service before it's usable:

<Image
    layout="intrinsic"
    quality={100}
    width={1148}
    height={524}
    src="https://res.cloudinary.com/railway/image/upload/v1687542048/docs/volumes/connect-volume-to-service_ao4s5h.png"
    alt="Connect volume to service"
/>

You must configure the mount point of the volume in your service:

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
- `RAILWAY_VOLUME_MOUNT_PATH`: Mount path of the volume (e.g. `/data`)

## Caveats

Volumes is a [Priority Boarding](/reference/priority-boarding) feature that
is still under development. Here are some limitations we are currently aware
of:

- Each service can only have a single volume
- Replicas cannot be used with volumes
- There is no built-in S/FTP support
- Down-sizing a volume is not currently supported, but increasing size is supported
- There is no file browser, or direct file download. To access your files,
you must do so via the attached service's mount point
- To prevent data corruption, we prevent multiple deployments from being active
and mounted to the same service. This means that there will be a small amount
of downtime when re-deploying a service that has a volume attached

<Banner variant="info">
Join the [🚅｜priority-boarding](https://discord.gg/railway) channel in our
[Discord server](https://discord.gg/railway) if you'd like to share feedback,
bug reports, feature requests, and questions.
</Banner>
