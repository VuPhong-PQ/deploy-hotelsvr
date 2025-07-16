// import images from all-images/blog-img directory
import img01 from "../all-images/blog-img/blog-1.jpg";
import img02 from "../all-images/blog-img/blog-2.jpg";
import img03 from "../all-images/blog-img/blog-3.jpg";

const blogData = [
  {
    id: 1,
    title: "Luxury Experience",
    author: "John",
    date: "12 Dec, 2020",
    time: "9pm",
    imgUrl: img01,
    description:
      "Located in the heart of the city, our luxury hotel offers an upscale experience with elegantly designed rooms, impeccable customer service, and modern amenities. Enjoy a lavish buffet breakfast and unwind at our premium spa.",
    quote:      "Luxury is not a place; it's a feeling.",
  },

  {
    id: 2,
    title: "Travel and Discovery",
    author: "Bart",
    date: "12 Dec, 2020",
    time: "9pm",
    imgUrl: img02,
    description:
      "Our beachfront resort is a paradise for sun-seekers and water enthusiasts. With stunning ocean views, spacious rooms, and direct access to pristine beaches, guests can relax by the pool or indulge in various water sports. Enjoy delicious seafood at our seaside restaurant.",
    quote:      "Travel is the only thing you buy that makes you richer.",
  },

  {
    id: 3,
    title: "Home Away from Home",
    author: "Lyly",
    date: "12 Dec, 2020",
    time: "9pm",
    imgUrl: img03,
    description:
      "Embrace sustainability at our eco-friendly hotel, where we prioritize green practices to minimize our environmental impact. Enjoy organic meals, energy-efficient accommodations, and nature-inspired decor while being just steps away from breathtaking natural surroundings.",
    quote:      "A hotel is a place where you can feel at home, even when you're away.",
  },
];

export default blogData;
