import { ApartmentModel } from "../models";
import v from "voca";

const createApartment = async (req, res) => {
  const {
    body: { name, address, location, description, price },
    user
  } = req;
  try {
    const slug = v.slugify(name);
    const [numberAndStreet, ward, district, province] = address.split(", ");
    const [number, ...street] = numberAndStreet.split(" ");
    const apartment = new ApartmentModel({
      name,
      slug,
      address: {
        addressFormated: address,
        province,
        district,
        ward,
        street: street.join(" "),
        number,
        location
      },
      description,
      price,
      user: user._id
    });
    await apartment.save();
    res.status(201).json({
      success: true,
      message: "Create Apartment successfull"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export default { createApartment };
