export class SecretResponse {
  constructor(
    id: string,
    title: string,
    value: string,
    description: string | null,
  ) {
    this.id = id;
    this.title = title;
    this.value = value;
    this.description = description;
  }

  id: string;
  title: string;
  value: string;
  description?: string | null;
}
