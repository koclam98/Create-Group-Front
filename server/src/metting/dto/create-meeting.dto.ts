export class CreateMeetingDto {
  title: string;
  desc: string;
  date: string; // ISO 8601 형식
  location: string;
  hostId: string;
}
