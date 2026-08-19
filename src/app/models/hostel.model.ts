export interface RoomType {
  sharing: string;
  totalRooms: number;
  availableRooms: number;
  pricePerYear: number;
}

export interface Hostel {
  id: string;
  name: string;
  type: string;
  totalRooms: number;
  availableRooms: number;
  totalBeds: number;
  availableBeds: number;
  feePerYear: number;
  facilities: string[];
  image: string;
  roomTypes: RoomType[];
}
