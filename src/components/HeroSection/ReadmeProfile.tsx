import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import readmeMarkdown from "../../../README.md?raw";

const markdownComponents: Components = {
  a({ href, children, ...props }) {
    const isEmailLink = href?.startsWith("mailto:");

    return (
      <a
        href={href}
        target={isEmailLink ? undefined : "_blank"}
        rel={isEmailLink ? undefined : "noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  },
  img({ alt, ...props }) {
    const imageClass =
      alt === "Neverlabs profile banner"
        ? "github-markdown-banner"
        : alt === "M. Syalman Al Farizi"
          ? "github-markdown-avatar"
          : "github-markdown-image";

    return <img alt={alt ?? ""} loading="lazy" className={imageClass} {...props} />;
  },
};

export default function ReadmeProfile() {
  return (
    <div className="github-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {readmeMarkdown}
      </ReactMarkdown>
    </div>
  );
}
