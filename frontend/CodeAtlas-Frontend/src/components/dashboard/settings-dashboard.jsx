import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SettingsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your CodeAtlas settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository Settings</CardTitle>

          <CardDescription>
            Configure repository indexing and other preferences.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Settings will be available here soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
