import { useCallback, useEffect, useState } from "react";

import { assetsApi } from "@/shared/api/assets";
import { photographsApi } from "@/shared/api/photographs";
import { postMsg } from "@/shared/utils";

type FormData = {
  title: string;
  description: string;
  author: string;
  photoUrl: string;
  position: {
    type: "Point";
    coordinates: [number, number];
  } | null;
  website: string;
};

export default () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    author: "",
    photoUrl: "",
    position: null,
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const handleStartPickLocation = useCallback(() => {
    if (isPickingLocation) {
      setIsPickingLocation(false);
      postMsg("stopPickLocation");
    } else {
      setIsPickingLocation(true);
      postMsg("startPickLocation");
    }
  }, [isPickingLocation]);

  const messageHandler = (e: MessageEvent) => {
    if (e.data.action === "locationPicked") {
      const { lng, lat } = e.data.payload;
      setFormData((prev) => ({
        ...prev,
        position: {
          type: "Point",
          coordinates: [lng, lat],
        },
      }));
      setIsPickingLocation(false);
    }
  };

  useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Clear photoUrl when starting new upload
      setFormData((prev) => ({
        ...prev,
        photoUrl: "",
      }));

      setIsUploading(true);
      try {
        const response = await assetsApi.upload(file);
        if (response.success && response.data) {
          setFormData((prev) => ({
            ...prev,
            photoUrl: response.data?.url ?? "",
          }));
        } else {
          console.error("Upload error:", response.error);
        }
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !formData.title.trim() ||
        !formData.author.trim() ||
        !formData.photoUrl.trim() ||
        !formData.position
      ) {
        console.error(
          "Please fill in all required fields (Title, Author, Image, and Position)"
        );
        return;
      }

      // Anti-bot validation
      if (formData.website.trim() !== "") {
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await photographsApi.create({
          title: formData.title,
          author: formData.author,
          description: formData.description || undefined,
          photoUrl: formData.photoUrl,
          position: formData.position,
        });

        if (response.success) {
          setFormData({
            title: "",
            description: "",
            author: "",
            photoUrl: "",
            position: null,
            website: "",
          });
          setIsSubmitSuccess(true);
        } else {
          console.error("API error:", response.error);
        }
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
        postMsg("cleanup");
      }
    },
    [formData]
  );

  const handleBackToForm = useCallback(() => {
    setIsSubmitSuccess(false);
  }, []);

  return {
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
  };
};
