import { Secret } from "@prisma/client";

export class UserResponse {
  constructor(
    id: string,
    name: string,
    email: string,
    secrets: Secret[],
    files: {
      filename: string;
      url: string;
      extension: string;
      mimeType: string;
    }[],
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.secrets = secrets;
    this.files = files;
  }

  id: string;
  name: string;
  email: string;
  secrets: Secret[];
  files: {
    filename: string;
    url: string;
    extension: string;
    mimeType: string;
  }[];
}
