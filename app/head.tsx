export default function Head() {
  return (
    <>
      <link rel="preload" as="image" href="/images/Background_1.webp" />
      <style>{`
        img[src*="Logo_3"], img[src*="%2Fimages%2FLogo_3"] { 
          object-fit: contain !important;
        }
      `}</style>
    </>
  )
}
