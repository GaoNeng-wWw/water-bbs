export declare module '@nestjs/cqrs' {
  interface IEvent {
    id?: string;
  }
}

declare global {
  type ImageNode = {
    attrs: {
      imageId: string;
    };
  }
}