# HLP pose display library

This manifest indexes the 23 HLP pose display references used by the HosieryLab pose library. The display images and contact sheet are stored in the public Cloudflare R2 bucket and are referenced by `image_path`.

- 23 display images: `poses/display/HLP-xxxx_display.png`
- Contact sheet: `poses/display/HLP-23_contact_sheet.png`
- Format: 768 × 1024 PNG
- Display treatment: matte skin-tone mannequin, beige bodysuit, warm grey studio background
- English names are the stable labels for workflow selection and website cards.

The source skeleton PNG and keypoint JSON assets remain under the existing `poses/` prefix. This file contains no credentials.
