import { Badge } from "@/components/ui/badge";

export default function LanguageBadge({ language }) {
    if (!language) {
        return null;
    }

    return (
        <Badge variant="secondary">
            {language}
        </Badge>
    );
}