const getMediaType = (file: File): "image" | "video" | "pdf" => {
  const type = file.type.split("/")[0]; // 'image', 'video', or 'application'

  switch (type) {
    case "image":
      return "image";
    case "video":
      return "video";
    case "application":
      if (file.type === "application/pdf") return "pdf";
      break;
  }

  throw new Error(`Unsupported MIME type: ${file.type}`);
};

export default getMediaType;
