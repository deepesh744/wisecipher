export default function Footer() {
    return (
      <footer className="bg-white border-t py-6 mt-16">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} WiseCipher. All rights reserved. <br/>
          <a href="/privacy" className="hover:underline">Privacy Policy</a> · <a href="mailto:hello@wisecipher.com" className="hover:underline">Contact Us</a>
        </div>
      </footer>
    )
  }
  