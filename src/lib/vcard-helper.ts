export const generateVCard = async (doctor: any) => {
    // 1. Helper to fold lines (RFC 2426, max 75 octets)
    const foldLine = (line: string): string => {
        const maxLength = 75;
        if (line.length <= maxLength) return line;

        // Split into chunks, subsequent lines start with a space
        const chunks: string[] = [];
        let remaining = line;

        // First chunk
        chunks.push(remaining.substring(0, maxLength));
        remaining = remaining.substring(maxLength);

        // Subsequent chunks (indented by 1 space, so take 74 chars)
        while (remaining.length > 0) {
            chunks.push(' ' + remaining.substring(0, maxLength - 1));
            remaining = remaining.substring(maxLength - 1);
        }

        return chunks.join('\r\n');
    };

    // 2. Helper to resize and process image
    const processImage = async (imageUrl: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Resize logic: Max 300x300
                const MAX_SIZE = 300;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    // Compress to JPEG 0.7 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    // Remove prefix
                    resolve(dataUrl.split(',')[1]);
                } else {
                    reject(new Error("Canvas context failed"));
                }
            };
            img.onerror = (e) => reject(e);
            img.src = imageUrl;
        });
    };

    try {
        let photoString = '';
        try {
            if (doctor.personal.profileImage) {
                const base64Image = await processImage(doctor.personal.profileImage);
                photoString = `PHOTO;ENCODING=b;TYPE=JPEG:${base64Image}`;
            }
        } catch (e) {
            console.warn("VCard image processing failed:", e);
        }

        const vCardLines = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${doctor.personal.fullName}`,
            `N:${doctor.personal.initials || ''};${doctor.personal.shortName.split(' ').slice(1).join(' ')};;;`, // Fallback logic
            `TITLE:${doctor.personal.title}`,
            `ORG:${doctor.positions[0]?.organization || ''}`,
            ...doctor.contact.phones.map((p: any) => `TEL;TYPE=${p.label.toUpperCase()}:${p.value}`),
            `EMAIL;TYPE=WORK:${doctor.contact.email}`,
            `URL:${doctor.contact.website}`,
            `ADR;TYPE=WORK:;;${doctor.clinics[0]?.name || ''};${doctor.clinics[0]?.address || ''};;;`,
            photoString,
            `NOTE:${doctor.vcard.notes.replace(/\n/g, '\\n')}`,
            'END:VCARD'
        ];

        // Filter empty lines and join with CRLF
        // IMPORTANT: Join with \r\n for standard VCard compatibility
        // Then map each line to fold it
        const finalVCard = vCardLines
            .filter(line => line.trim() !== '')
            .map(foldLine)
            .join('\r\n');

        return finalVCard;

    } catch (err) {
        console.error("VCard generation error:", err);
        throw err;
    }
};
