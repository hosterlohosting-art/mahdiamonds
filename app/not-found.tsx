import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main id="main-content" className="not-found"><p className="eyebrow">MAH Diamonds</p><h1>This page has not been set.</h1><p>The requested route is not part of the current MAH website foundation.</p><Link className="button button-dark" href="/"><ArrowLeft size={15} /> Return home</Link></main>;
}
