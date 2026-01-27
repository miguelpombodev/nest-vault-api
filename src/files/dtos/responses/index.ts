export class SaveSecretFileDTO {
  constructor(
    originalName: string,
    mimetype: string,
    buffer: Buffer<ArrayBufferLike>,
    userId: string,
    description: string | null,
  ) {
    this.Name = `${userId}_${originalName}_${Date.now()}`;
    this.Extension = originalName.split(".")[1];
    this.Mimetype = mimetype;
    this.Buffer = buffer;
    this.Description = description;
  }

  Name: string;
  Extension: string;
  Mimetype: string;
  Buffer: Buffer<ArrayBufferLike>;
  Description: string | null;
}
