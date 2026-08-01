# Section to add BELOW the upload/convert button, ABOVE "Related"

## Why convert EPUB to PDF?

EPUB files are built to reflow — text resizes and re-wraps depending on the screen, which is great for e-readers but unpredictable for printing or sharing. Converting to PDF locks in a fixed layout, so page breaks, margins, and formatting stay exactly the same no matter who opens the file or what device they use.

This is useful when you need to print a chapter for offline reading, submit an eBook manuscript in a fixed format, archive a book in a format almost any device can open, or share a document with someone who doesn't have an EPUB reader installed. Since the conversion runs entirely in your browser, the original file — and the PDF it becomes — never touch a server.

## How it works

1. Drop your EPUB file into the box above, or click to browse and select it.
2. PDFly reads the file locally and rebuilds it as a paginated PDF, preserving chapter breaks and images.
3. Click **Convert to PDF** and download the result — no upload, no wait, no watermark.

## Frequently asked questions

**Will the formatting stay the same after conversion?**
Chapter structure, images, and text stay intact. Because EPUB is reflowable and PDF is fixed-layout, page breaks are recalculated to fit a standard page size, so exact pagination will differ from the original eBook.

**Is there a file size limit?**
No artificial limit — since conversion happens on your device, the practical limit is your browser's available memory, same as PDFly's other tools.

**Does this work with DRM-protected EPUB files?**
No. DRM-protected files are encrypted by the retailer (e.g., Amazon, Kobo) and can't be processed by browser-based tools. This works with unprotected EPUB files, such as those you've authored yourself or downloaded from open sources like Project Gutenberg.

**Do I need to install anything?**
No. Everything runs in your browser tab — no software, no account, no sign-up.

---

# Suggested schema (add to page <head> or via your existing schema component)

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Will the formatting stay the same after conversion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Chapter structure, images, and text stay intact. Because EPUB is reflowable and PDF is fixed-layout, page breaks are recalculated to fit a standard page size, so exact pagination will differ from the original eBook."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a file size limit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No artificial limit — since conversion happens on your device, the practical limit is your browser's available memory, same as PDFly's other tools."
      }
    },
    {
      "@type": "Question",
      "name": "Does this work with DRM-protected EPUB files?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. DRM-protected files are encrypted by the retailer and can't be processed by browser-based tools. This works with unprotected EPUB files, such as those you've authored yourself or downloaded from open sources like Project Gutenberg."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to install anything?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Everything runs in your browser tab — no software, no account, no sign-up."
      }
    }
  ]
}
