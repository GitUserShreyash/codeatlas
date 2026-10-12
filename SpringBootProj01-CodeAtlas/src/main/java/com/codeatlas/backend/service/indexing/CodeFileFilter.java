package com.codeatlas.backend.service.indexing;

import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class CodeFileFilter {
	
	private static final Set<String> SKIP_DIR_PARTS = Set.of(
			"node_modules",
			".git",
			"dist",
			"build",
			"target",
			".next",
			"vendor",
			"__pycache__",
			".idea",
			".vscode",
			"coverage",
			"out");
	
	private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
			"java", "kt", "kts", "scala",
			"ts", "tsx", "js", "jsx", "mjs", "cjs",
			"py", "go", "rs", "rb", "php",
			"c", "h", "cpp", "hpp", "cs",
			"swift", "m", "mm",
			"md", "mdx", "txt",
			"yml", "yaml", "json", "toml", "xml",
			"properties", "gradle", "sql",
			"sh", "bash", "zsh",
			"dockerfile", "makefile",
			"html", "css", "scss", "sass",
			"vue", "svelte");
	
	private static final Set<String> SKIP_FILENAMES = Set.of(
			"package-lock.json",
			"yarn.lock",
			"pnpm-lock.yaml",
			"composer.lock",
			"argo.lock",
			"poetry.lock");
	
	public boolean isEligible(String path, long sizeBytes, long maxFileBytes) {

	    if (path == null || path.isBlank()) {
	        return false;
	    }

	    // Normalize Windows and Unix path separators
	    String normalized = path.replace('\\', '/');
	    String lower = normalized.toLowerCase(Locale.ROOT);

	    // Skip files inside unwanted directories
	    for (String part : lower.split("/")) {
	        if (SKIP_DIR_PARTS.contains(part)) {
	            return false;
	        }
	    }

	    // Extract the filename
	    String fileName = lower.substring(lower.lastIndexOf('/') + 1);

	    // Skip specific filenames
	    if (SKIP_FILENAMES.contains(fileName)) {
	        return false;
	    }

	    // Skip hidden files
	    if (fileName.startsWith(".")) {
	        return false;
	    }

	    // Skip empty files and files exceeding the size limit
	    if (sizeBytes <= 0 || sizeBytes > maxFileBytes) {
	        return false;
	    }
	    
	    // Extract extension 
	    int dot = lower.lastIndexOf(".");
	    if(dot<0) {
	    	return false;
	    }
	    
	    String extension = lower.substring(dot+1);
	    
	    //Skip not allowed extensions
	    if(!ALLOWED_EXTENSIONS.contains(extension)) {
	    	return false;
	    }

	    return true;
	}
	
	public String detectLanguage(String path) {
		String lower = path.toLowerCase(Locale.ROOT);
		String fileName = lower.substring(lower.lastIndexOf("/")+1);
		if("dockerfile".equals(fileName)) {
			return "dockerfile";
		}
		if("makerfile".equals(fileName)) {
			return "makerfile";
		}
		int dot = fileName.lastIndexOf(".");
		if(dot < 0) {
			return "text";
		}
		return fileName.substring(dot+1);
	}
}
