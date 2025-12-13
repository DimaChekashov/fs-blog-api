export interface Post {
  id: number;
  title: string;
  created_at: Date;
}

export class CreatePostDto {
  constructor(public readonly title: string) {}
}

export class UpdatePostDto {
  constructor(public readonly id: number, public readonly title: string) {}
}

export class DeletePostDto {
  constructor(public readonly id: number) {}
}
