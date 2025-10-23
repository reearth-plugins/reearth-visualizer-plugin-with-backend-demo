import useHooks from "./hooks";
import useClient from "./useClient";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

function App() {
  useClient();

  const {
    formData,
    handleStartPickLocation,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    handleBackToForm,
    isSubmitting,
    isUploading,
    isPickingLocation,
    isSubmitSuccess,
  } = useHooks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Street Photograph Submitter</CardTitle>
        <CardDescription>
          Submit your photograph with title, description, and author information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSubmitSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-md text-green-600 font-medium">
              🎉 Success!
              <br />
              Your street photograph has been submitted successfully!
            </p>
            <Button
              onClick={handleBackToForm}
              variant="outline"
              className="w-full"
            >
              Submit Another Photo
            </Button>
          </div>
        ) : (
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Position *</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant={isPickingLocation ? "default" : "outline"}
                  disabled={isUploading}
                  onClick={handleStartPickLocation}
                >
                  {isPickingLocation ? "Stop picking" : "Pick on map"}
                </Button>
                {formData.position && (
                  <p className="text-sm text-green-600">
                    ✓ Position selected:{" "}
                    {formData.position.coordinates[1].toFixed(6)},{" "}
                    {formData.position.coordinates[0].toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                disabled={isPickingLocation}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Photograph *</Label>
              {formData.photoUrl && (
                <div className="mb-2">
                  <img
                    src={formData.photoUrl}
                    alt="Uploaded photograph"
                    className="max-w-full h-48 object-cover rounded"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading || isPickingLocation}
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  {isUploading
                    ? "Uploading..."
                    : formData.photoUrl
                      ? "Change Image"
                      : "Upload Image"}
                </Button>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading || isPickingLocation}
                  className="hidden"
                  required
                />
                {!isUploading && formData.photoUrl && (
                  <span className="text-sm text-green-600">✓ Uploaded</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description (optional)"
                disabled={isPickingLocation}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                disabled={isPickingLocation}
                required
              />
            </div>

            <div className="space-y-2 hp">
              <Label htmlFor="website">Website</Label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                isUploading ||
                isPickingLocation ||
                !formData.photoUrl ||
                !formData.position
              }
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default App;
