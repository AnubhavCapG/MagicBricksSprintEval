export interface PropertyData {
  userType: string;
  listingType: string;
  propertyType: string;
  city: string;
  locality: string;
  bhk: string;
  area: string;
  bathrooms: string;
  furnishing: string;
  price: string;
}

export const validPropertyData: PropertyData = {
  userType: "Owner",
  listingType: "Sell",
  propertyType: "Apartment",
  city: "Bangalore",
  locality: "Whitefield",
  bhk: "2",
  area: "1200",
  bathrooms: "2",
  furnishing: "Semi-Furnished",
  price: "7500000",
};
