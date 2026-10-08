import { Coffee, Code2, FileCode } from "lucide-react"
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiHtml5,
  SiCplusplus,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
} from "react-icons/si"

export function LanguageIcon({ language, className = "size-4" }) {
  const lang = (language || "").toLowerCase().trim()

  // Java -> Hot Coffee Cup
  if (lang === "java" || (lang.includes("java") && !lang.includes("script"))) {
    return <Coffee className={`${className} text-amber-600 dark:text-amber-500`} />
  }

  // JavaScript -> JS yellow badge
  if (lang.includes("javascript") || lang === "js") {
    return <SiJavascript className={`${className} text-yellow-500 fill-yellow-500`} />
  }

  // TypeScript -> TS blue badge
  if (lang.includes("typescript") || lang === "ts") {
    return <SiTypescript className={`${className} text-blue-500 fill-blue-500`} />
  }

  // Python -> Blue/Yellow Python logo
  if (lang.includes("python") || lang === "py") {
    return <SiPython className={`${className} text-sky-500 fill-sky-500`} />
  }

  // HTML5
  if (lang.includes("html")) {
    return <SiHtml5 className={`${className} text-orange-500 fill-orange-500`} />
  }

  // CSS
  if (lang.includes("css")) {
    return <FileCode className={`${className} text-blue-600`} />
  }

  // C++ / C
  if (lang.includes("c++") || lang.includes("cpp") || lang === "c") {
    return <SiCplusplus className={`${className} text-blue-700 fill-blue-700`} />
  }

  // Go / Golang
  if (lang.includes("go") || lang === "golang") {
    return <SiGo className={`${className} text-cyan-500 fill-cyan-500`} />
  }

  // Rust
  if (lang.includes("rust")) {
    return <SiRust className={`${className} text-amber-700 dark:text-amber-500`} />
  }

  // PHP
  if (lang.includes("php")) {
    return <SiPhp className={`${className} text-indigo-400 fill-indigo-400`} />
  }

  // Ruby
  if (lang.includes("ruby")) {
    return <SiRuby className={`${className} text-red-600 fill-red-600`} />
  }

  // Swift
  if (lang.includes("swift")) {
    return <SiSwift className={`${className} text-orange-600 fill-orange-600`} />
  }

  // Kotlin
  if (lang.includes("kotlin")) {
    return <SiKotlin className={`${className} text-purple-500 fill-purple-500`} />
  }

  return <Code2 className={`${className} text-primary`} />
}

export default LanguageIcon
