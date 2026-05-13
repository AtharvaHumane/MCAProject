import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

const apiBaseUrl = "http://localhost:5000/api";

const salonGalleryImages = [
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80"
];

const getSalonImage = (index = 0) => salonGalleryImages[index % salonGalleryImages.length];

const serviceCatalogBase = [
  {
    type: "Hair Cut",
    subtitle: "Professional cuts for every style and personality.",
    image: "https://thumbs.dreamstime.com/b/professional-hair-cutting-tools-organized-neatly-barbers-workbench-ready-use-comprehensive-collection-barbering-416355282.jpghttps://thumbs.dreamstime.com/b/various-hair-dresser-cut-tools-black-background-copy-space-various-hair-dresser-tools-161810714.jpg",
    items: [
      { name: "Basic Hair Cut", price: 150, subtitle: "Neat everyday grooming", image: "https://images.unsplash.com/photo-1606333259737-6da197890fa2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFzaWMlMjBoYWlyJTIwY3V0fGVufDB8MHwwfHx8MA%3D%3D" },
      { name: "Stylish Hair Cut", price: 250, subtitle: "Modern cut with shape", image: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3R5bGlzaCUyMEhhaXIlMjBDdXR8ZW58MHwwfDB8fHww" },
      { name: "Layer Cut", price: 300, subtitle: "Adds texture and movement", image: "https://images.unsplash.com/photo-1647462741351-4e7a5e7317c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGF5ZXIlMjBDdXR8ZW58MHwwfDB8fHww" },
      { name: "Step Cut", price: 300, subtitle: "Layered stepped finish", image: "https://images.unsplash.com/photo-1602982903808-29f783644d21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN0ZXAlMjBDdXR8ZW58MHwwfDB8fHww" },
      { name: "Fade Cut", price: 350, subtitle: "Sharp taper with clean edges", image: "https://plus.unsplash.com/premium_photo-1661288513057-8537363b1756?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFkZSUyMEN1dHxlbnwwfDB8MHx8fDA%3D" },
      { name: "Undercut", price: 300, subtitle: "Bold top-heavy style", image: "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHVuZGVyQ3V0fGVufDB8MHwwfHx8MA%3D%3D" },
      { name: "Kids Hair Cut", price: 120, subtitle: "Simple and comfortable", image: "https://images.unsplash.com/photo-1521490683712-35a1cb235d1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGtpZHMlMjBDdXR8ZW58MHwwfDB8fHww" },
      { name: "Senior Citizen Cut", price: 100, subtitle: "Gentle, tidy grooming", image: "https://images.unsplash.com/photo-1758732461536-90cd5033a4d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFNlbmlvciUyMENpdGl6ZW4lMjBDdXR8ZW58MHwwfDB8fHww" },
      { name: "Beard + Hair Combo Cut", price: 400, subtitle: "Complete head-to-beard look", image: "https://images.unsplash.com/photo-1590410240244-9c28d8c26d3c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmVhcmQlMjAlMkIlMjBIYWlyJTIwQ29tYm8lMjBDdXR8ZW58MHwwfDB8fHww" },
      { name: "Premium Salon Cut", price: 500, subtitle: "Signature luxury styling", image: "https://plus.unsplash.com/premium_photo-1661380558859-40df8dd91dfd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UHJlbWl1bSUyMFNhbG9uJTIwQ3V0fGVufDB8MHwwfHx8MA%3D%3D" }
    ]
  },
  {
    type: "Beard",
    subtitle: "Sharp beard trims, clean shaves, and grooming rituals.",
    image:
      "https://poojabeautyparlourwgl.com/wp-content/uploads/2022/01/portfolio-03-800x500.jpg",
    items: [
      { name: "Basic Beard Trim", price: 80, subtitle: "Quick tidy-up trim", image: "https://plus.unsplash.com/premium_photo-1661493935776-a76a3e33dddf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QmFzaWMlMjBCZWFyZCUyMFRyaW18ZW58MHwwfDB8fHww" },
      { name: "Short Beard Trim", price: 150, subtitle: "Shape and style control", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZpt9altvSBZ4oFPwUzJEcpxMxFpLR3uQ7cA&s" },
      { name: "Medium Beard Styling", price: 100, subtitle: "Smooth finish shave", image: "https://images.unsplash.com/photo-1621095346111-a25f48b39b66?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWVkaXVtJTIwQmVhcmQlMjBTdHlsaW5nfGVufDB8MHwwfHx8MA%3D%3D" },
      { name: "Full Beard Shaping", price: 120, subtitle: "Classic barber razor work", image: "https://blogscdn.thehut.net/app/uploads/sites/571/2019/08/shape-beard-neckline_1565007989-2-1_1601627493.jpg" },
      { name: "Fade Beard Trim", price: 180, subtitle: "Detailed design shaping", image: "https://plus.unsplash.com/premium_photo-1661645788141-8196a45fb483?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFkZSUyMEJlYXJkJTIwVHJpbXxlbnwwfDB8MHx8fDA%3D" },
      { name: "Contour Beard Trim", price: 200, subtitle: "Controlled long-beard styling", image: "https://images.squarespace-cdn.com/content/v1/5616c8cde4b0bbc1cabb7c79/1687902121631-CDHY1N4F7YYZ56B3NCOA/barber-using-shaving-cream-contour-male-customer-s-beard.jpg?format=1500w" },
      { name: "Designer Beard Styling", price: 250, subtitle: "Natural-looking color refresh", image: "https://mxp-media.ilnmedia.com/media/content/2020/Mar/Hottest-Beard-Styles-Of-20205_5e64d0f62ba5f.jpeg?w=450&h=337.5" },
      { name: "Tapered Beard Trim", price: 300, subtitle: "Deep care and softening", image: "https://images.unsplash.com/photo-1654097803253-d481b6751f29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8VGFwZXJlZCUyMEJlYXJkJTIwVHJpbXxlbnwwfDB8MHx8fDA%3D" },
      { name: "Beard + Mustache Styling", price: 180, subtitle: "Relaxing hot towel treatment", image: "https://hairstyleonpoint.com/wp-content/uploads/2021/03/Full-Beard-and-Mustache.jpg" },
      { name: "Premium Beard Grooming", price: 350, subtitle: "Luxury grooming service", image: "https://images.unsplash.com/photo-1533808232502-bee53575c3af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UHJlbWl1bSUyMEJlYXJkJTIwR3Jvb21pbmd8ZW58MHwwfDB8fHww" }
    ]
  },
  {
    type: "Massage",
    subtitle: "Relaxing massage therapies for body and mind.",
    image:
      "https://c8.alamy.com/zooms/9/e5c87f1c41dc45a6838f632842db92ca/2dawe64.jpg",
    items: [
      { name: "Head Massage", price: 100, subtitle: "Quick stress relief", image: "https://img.freepik.com/free-photo/closeup-man-getting-head-massage-relaxing-with-eyes-closed-spa_637285-1721.jpg" },
      { name: "Oil Head Massage", price: 150, subtitle: "Deep soothing scalp care", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80" },
      { name: "Shoulder Massage", price: 120, subtitle: "Release upper-body tension", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnvDv3tjT3tBwzfzVyfNET1xnISthguufSOw&s" },
      { name: "Full Body Massage", price: 600, subtitle: "Complete body relaxation", image: "https://glazma.com/static/media/glazma-men's-massage-salon.b325af681d8943a7aeb3.jpg" },
      { name: "Foot Massage", price: 150, subtitle: "Rest and recovery for feet", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZD6-fg56rtFWLh6Z9gGYHp0hMVRdRgLYbw&s" },
      { name: "Neck Massage", price: 120, subtitle: "Ease tight neck muscles", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGiUJTIFEk5UoZG2BbZd7deyGAiJgwYwnqpA&s" },
      { name: "Relaxation Massage", price: 400, subtitle: "Calming wellness session", image: "https://naturalspapune.com/wp-content/uploads/2023/07/Untitled-design-11-1024x768.png" },
      { name: "Deep Tissue Massage", price: 700, subtitle: "Targeted muscle release", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVu2kUBSPAq7ydb2obOCjfRB6iQVxOac0nqA&s" },
      { name: "Aroma Therapy Massage", price: 800, subtitle: "Essential oil spa blend", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu1QL6r9o6box8fCUcPy1Wu2Q1qYzvzOdDSg&s" },
      { name: "Premium Spa Massage", price: 1200, subtitle: "Full luxury treatment", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykBSWZBElBpvJgVrf-CvFWVm_u1E9b-dfmQ&s" }
    ]
  },
  {
    type: "Hair Spa",
    subtitle: "Nourishing spa care for softness, shine, and repair.",
    image:
      "https://imgmediagumlet.lbb.in/media/2023/06/649c2d404a32d7701e70c4ea_1687956800644.jpg",
    items: [
      { name: "Basic Hair Spa", price: 300, subtitle: "Simple refresh and care", image: "https://i-media.vyaparify.com/vcards/blogs/129114/Glazma-Hair-spa.jpg" },
      { name: "Anti-Dandruff Spa", price: 400, subtitle: "Scalp comfort treatment", image: "https://ghc.health/cdn/shop/articles/WhatsApp_Image_2021-10-14_at_10.59.55_AM_1.jpg?v=1634202112" },
      { name: "Hair Fall Control Spa", price: 450, subtitle: "Strengthening support", image: "https://www.thriveco.in/cdn/shop/files/6_a0afcb6c-d5bf-452f-9ef2-5927a8157dc7_2.webp?v=1753424079&width=500" },
      { name: "Protein Hair Spa", price: 500, subtitle: "Repair with protein care", image: "https://5.imimg.com/data5/SELLER/Default/2025/6/521341463/YP/XL/WZ/217165649/eye-lashes.jpeg" },
      { name: "Smoothening Spa", price: 600, subtitle: "Softer, smoother finish", image: "https://content.jdmagicbox.com/comp/def_content/hair-spas-for-men/d686b07e69-hair-spas-for-men-4-eg0b8.jpg" },
      { name: "Keratin Hair Spa", price: 700, subtitle: "Keratin smoothing care", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTauaU2RPVA3fB6kp3HYKs3XTNE7nui6PrtZQ&s" },
      { name: "Scalp Treatment Spa", price: 550, subtitle: "Healthy scalp restoration", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" },
      { name: "Herbal Hair Spa", price: 450, subtitle: "Plant-based nourishment", image: "https://herbsense.in/cdn/shop/files/new_hair_spa_image_2.jpg?v=1766837418&width=1946" },
      { name: "Oil Therapy Spa", price: 350, subtitle: "Warm oil therapy care", image: "https://ghc.health/cdn/shop/articles/handsome-man-relaxing-spa_144627-2263.jpg?v=1622535973" },
      { name: "Premium Hair Spa", price: 900, subtitle: "Luxury repair ritual", image: "https://assets.gqindia.com/photos/5dce7cc8836a7f0008bf47be/master/pass/Spas%20and%20salons%20for%20men%20in%20Mumbai.jpg" }
    ]
  },
  {
    type: "Face Mask",
    subtitle: "Fresh masks for glow, hydration, and skin clarity.",
    image:
      "https://thumbs.dreamstime.com/b/mud-facial-mask-men-spa-salon-massage-clay-full-face-girl-therapy-room-man-lying-spa-bed-beautician-103315687.jpg",
    items: [
      { name: "Basic Face Mask", price: 100, subtitle: "Simple skin refresh", image: "https://cdn.credihealth.com/production/system/images/assets/79882/original/5-long-term-benefits-of-face-mask-for-men-3009.webp?1729078498" },
      { name: "Fruit Face Mask", price: 150, subtitle: "Vitamin-rich glow care", image: "https://thumbs.dreamstime.com/b/facial-mask-fresh-fruits-man-beautician-apply-slices-clay-avocado-grapefruit-kiwi-male-lying-spa-bed-has-89945649.jpg" },
      { name: "Charcoal Mask", price: 200, subtitle: "Deep pore cleansing", image: "https://prod-cdn.hook.online/images/original/2025/6/27/8-best-charcoal-face-masks-for-men-that-go-deep-detox-the-skin-1751022575862.jpg" },
      { name: "Gold Face Mask", price: 250, subtitle: "Radiance-focused treatment", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTltmeahXZ00tNqhWAHoxSHlzb6rIYwg58qlw&s" },
      { name: "Anti-Acne Mask", price: 180, subtitle: "Blemish support care", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN_chtgy-g01JOqbtO4GxitGaPtljAqqzYJw&s" },
      { name: "Hydrating Mask", price: 220, subtitle: "Moisture boost therapy", image: "https://cdn.shopify.com/s/files/1/1049/3064/files/face_masks_for_men_2_large.jpg?v=1553539023" },
      { name: "Herbal Mask", price: 200, subtitle: "Gentle natural care", image: "https://cdn.shopify.com/s/files/1/2395/7673/files/MULTANI-MITTI-MEN-FACE-PACK-2_480x480.jpg?v=1657540679" },
      { name: "Whitening Mask", price: 250, subtitle: "Brightness enhancement", image: "https://static.wixstatic.com/media/c508e3_21f2a99209234f0caa3709dae2124da7~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/c508e3_21f2a99209234f0caa3709dae2124da7~mv2.jpg" },
      { name: "Detan Mask", price: 300, subtitle: "Tan removal treatment", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGhPL1k5NUOksjBaYR7tmPhsFN0gRmPUW2sQ&s" },
      { name: "Premium Glow Mask", price: 400, subtitle: "Brighter luxury finish", image: "https://www.particleformen.com/wp-content/uploads/2020/02/bd9ddbf3e74fbc475cf5be593b2f1b099015f220-1-scaled.jpg" }
    ]
  },
  {
    type: "Hair Color",
    subtitle: "Color services from subtle root touch-ups to bold fashion shades.",
    image:
      "https://static.wixstatic.com/media/c508e3_ea171fcc84ee4fb8aabacd7e0ae7c27f~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/c508e3_ea171fcc84ee4fb8aabacd7e0ae7c27f~mv2.jpg",
    items: [
      { name: "Root Touch-Up", price: 300, subtitle: "Freshen the roots", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWwldqfKC_bL-WI5WjvMZmqB5fLyYFqV-yKg&s" },
      { name: "Global Hair Color", price: 800, subtitle: "All-over color change", image: "https://alurabeautysalon.com/wp-content/uploads/2021/07/Global-Hair-ColourMale.jpg" },
      { name: "Highlights", price: 700, subtitle: "Light-catching strands", image: "https://www.newtimeshair.com/wp-content/uploads/2024/10/3-platinum-rebel.jpg" },
      { name: "Lowlights", price: 700, subtitle: "Soft depth and contrast", image: "https://i.pinimg.com/originals/e8/ee/21/e8ee21ac1d134ca51526263f92800926.jpg" },
      { name: "Beard Color", price: 250, subtitle: "Blend beard tones", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy0XXK7d0FwQuv6PNuvPPY2rvjf2aWBdTVvw&s" },
      { name: "Ammonia-Free Color", price: 900, subtitle: "Gentler color option", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJmbCprQ0QHL8sFjeE35gEr6RVAMjZEMe8mg&s" },
      { name: "Fashion Color", price: 1200, subtitle: "Creative bold shade", image: "https://i.pinimg.com/474x/a0/e6/1e/a0e61e45069c9fbd807b14c53ae63451.jpg" },
      { name: "Streak Coloring", price: 500, subtitle: "Accent color streaks", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR437icem87_gtAKvYV5KQ8p0ZibnJPrK83Uw&s" },
      { name: "Temporary Color", price: 300, subtitle: "Short-term color trial", image: "https://i.pinimg.com/736x/6a/93/4a/6a934a8bedbc54a66dae4b1de4778b26.jpg" },
      { name: "Premium Hair Color", price: 1500, subtitle: "Signature color service", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZHC85nwRTy_8fporKOJP0jIjAp9SU9l-_Ug&s" }
    ]
  },
  {
    type: "Facial",
    subtitle: "Facials for skin polish, glow, and advanced care.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfIDNEvsDTu_Frf5M1wCgypxS7mvBcnEufBw&s",
    items: [
      { name: "Oxygen Facial", price: 300, subtitle: "Simple cleansing facial", image: "https://novoskin.life/wp-content/uploads/2025/03/Cosmetic-Clinic-Novoskin-Services-Face-Clinic-treatment-Oxygeneo-3-in-1-Super-Facial-BODY-TREATMENTS-WITH-OXYGENEO-Toronto-Ontario-Canada-1.webp" },
      { name: "Collagen Facial", price: 400, subtitle: "Fresh fruit-infused care", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAIJ3edgok2k0GeWGs5gxzLTgj8stwbRHKUA&s" },
      { name: "Gold Facial", price: 600, subtitle: "Glow and premium finish", image: "https://vanessamarc.com/cdn/shop/files/Men_s24KGoldFacial_1000x.png?v=1741556497" },
      { name: "Vitamin C Facial", price: 800, subtitle: "Brightening luxury facial", image: "https://mxp-media.ilnmedia.com/media/content/2022/Sep/how-to-use-vitamin-c-serum-on-your-face-amp-image_6315f24e6a0b7.jpeg" },
      { name: "Chemical Peel Facial", price: 900, subtitle: "Firming skin support", image: "https://healthcarpenter.com/storage/2025/01/Chemical-Peels-in-Orlando-FL-by-The-Health-Carpenter.webp" },
      { name: "Hydrafacial", price: 700, subtitle: "Acne-focused treatment", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyFZI7uqpSq2sCmzs79sYSodzA2seqNrro1g&s" },
      { name: "LED Light Therapy Facial", price: 750, subtitle: "Tone and radiance boost", image: "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/blog_posts/psoriasis/woman-receiving-red-light-therapy-on-face/1800x1200-woman-receiving-red-light-therapy-on-face.jpg" },
      { name: "Herbal Facial", price: 500, subtitle: "Gentle botanical care", image: "https://www.yesmadam.com/blog/wp-content/uploads/Homemade-Facial-for-Men-3.jpg" },
      { name: "Pearl Facial", price: 650, subtitle: "Sun tan recovery facial", image: "https://m.media-amazon.com/images/I/61G2np2p-qL.jpg" },
      { name: "Skin Detox Facial", price: 1200, subtitle: "High-end spa facial", image: "https://static.vecteezy.com/system/resources/previews/069/594/645/non_2x/refreshing-facial-treatment-session-for-skin-rejuvenation-with-soft-face-mask-application-free-photo.jpeg" }
    ]
  }
];

const serviceImageGroups = {
  "Hair Cut": [
    "https://images.unsplash.com/photo-1606333259737-6da197890fa2?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
  ],
  Beard: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80"
  ],
  Massage: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
  ],
  "Hair Spa": [
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
  ],
  "Face Mask": [
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80"
  ],
  "Hair Color": [
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80"
  ],
  Facial: [
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1527799820374-36f3f9f5a1c0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=600&q=80"
  ]
};

const serviceCatalog = serviceCatalogBase.map((category) => ({
  ...category,
  image: category.image || serviceImageGroups[category.type]?.[0] || "",
  items: category.items.map((item, index) => ({
    ...item,
    image:
      item.image ||
      serviceImageGroups[category.type]?.[index] ||
      category.image ||
      salonGalleryImages[index % salonGalleryImages.length]
  }))
}));

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM"
];

function CustomerDashboard() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState(serviceCatalog[0].type);
  const [selectedService, setSelectedService] = useState(serviceCatalog[0].items[0]);
  const [cartReady, setCartReady] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const cartStorageKey = `customerCart:${user?._id || "guest"}`;
  const currentCategory = serviceCatalog.find((item) => item.type === selectedType) || serviceCatalog[0];
  const displayedService = currentCategory.items.find((item) => item.name === selectedService?.name) || currentCategory.items[0];
  const currentCategoryIndex = serviceCatalog.findIndex((item) => item.type === currentCategory.type);
  const previewImage = currentCategory.image || getSalonImage(currentCategoryIndex);
  const total = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const minimumDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadSavedCart = async () => {
      if (!user?._id) {
        setCart([]);
        setCartReady(true);
        return;
      }

      try {
        const res = await axios.get(`${apiBaseUrl}/auth/cart/${user._id}`);
        const savedCart = Array.isArray(res.data?.savedCart) ? res.data.savedCart : [];
        setCart(savedCart);
        localStorage.setItem(cartStorageKey, JSON.stringify(savedCart));
      } catch (error) {
        console.error("Failed to load cart from server:", error);

        try {
          const storedCart = localStorage.getItem(cartStorageKey);
          setCart(storedCart ? JSON.parse(storedCart) : []);
        } catch (fallbackError) {
          console.error("Failed to load fallback cart:", fallbackError);
          setCart([]);
        }
      } finally {
        setCartReady(true);
      }
    };

    loadSavedCart();
  }, [cartStorageKey, user?._id]);

  useEffect(() => {
    const saveCart = async () => {
      if (!cartReady || !user?._id) {
        return;
      }

      try {
        await axios.put(`${apiBaseUrl}/auth/cart/${user._id}`, { savedCart: cart });
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to server:", error);

        try {
          localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        } catch (fallbackError) {
          console.error("Failed to save fallback cart:", fallbackError);
        }
      }
    };

    saveCart();
  }, [cart, cartStorageKey, cartReady, user?._id]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/auth/owners`);
        setOwners(res.data);

        if (res.data.length > 0) {
          setOwnerId(res.data[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch owners:", error);
        setSnackbar({
          open: true,
          message: "Could not load salon owners right now.",
          severity: "error"
        });
      }
    };

    fetchOwners();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const addToCart = (item, category) => {
    setCart((prev) => [...prev, { ...item, category }]);
    showSnackbar(`${item.name} added to cart.`);
  };

  const selectCategory = (event) => {
    const nextType = event.target.value;
    setSelectedType(nextType);

    const nextCategory = serviceCatalog.find((item) => item.type === nextType) || serviceCatalog[0];
    setSelectedService(nextCategory.items[0]);
  };

  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBooking = async () => {
    if (!ownerId) {
      showSnackbar("Please select a salon owner.", "error");
      return;
    }

    if (!date) {
      showSnackbar("Please select a booking date.", "error");
      return;
    }

    if (!time) {
      showSnackbar("Please select a time slot.", "error");
      return;
    }

    if (!cart.length) {
      showSnackbar("Please add at least one service to your cart.", "error");
      return;
    }

    try {
      await axios.post(`${apiBaseUrl}/bookings`, {
        customer: user?._id,
        customerName: user?.name,
        owner: ownerId,
        services: cart.map(({ name, price, category }) => ({ name, price, category })),
        total,
        date,
        time
      });

      setCart([]);
      setDate("");
      setTime("");
      setCartOpen(false);
      showSnackbar("Appointment booked successfully.");
    } catch (error) {
      console.error("Failed to create booking:", error);
      showSnackbar(
        error.response?.data?.message || "Could not book the appointment right now.",
        "error"
      );
    }
  };

  const handleLogout = async () => {
    try {
      if (user?._id) {
        await axios.put(`${apiBaseUrl}/auth/cart/${user._id}`, { savedCart: [] });
      }
      localStorage.removeItem(cartStorageKey);
    } catch (error) {
      console.error("Failed to clear saved cart on logout:", error);
    } finally {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleProfileAction = (action) => {
    handleProfileMenuClose();

    if (action === "profile") {
      showSnackbar("Profile view is coming soon.");
      return;
    }

    if (action === "bookings") {
      showSnackbar("Your bookings view is coming soon.");
      return;
    }

    if (action === "logout") {
      handleLogout();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(245,158,11,0.16), transparent 18%), #09090b",
        color: "#f8fafc",
        p: { xs: 2, md: 4 }
      }}
    >
      <Box sx={{ maxWidth: 1450, mx: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            px: { xs: 2, md: 3 },
            py: 2,
            borderRadius: 4,
            background: "rgba(15,15,15,0.72)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.28)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#f59e0b",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontSize: 12
                }}
              >
                Customer Dashboard
              </Typography>
              <Typography sx={{ color :'white' ,fontSize: { xs: 20, md: 30 }, fontWeight: 900, lineHeight: 1.05 }}>
                Book your salon appointment
              </Typography>
              <Typography sx={{ color: "rgba(248, 250, 252, 0.7)", mt: 1 }}>
                Select services, then open the cart to choose your date and time slot.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={() => setCartOpen(true)}
                startIcon={
                  <Badge badgeContent={cart.length} color="error">
                    <ShoppingCartRoundedIcon />
                  </Badge>
                }
                sx={{
                  borderColor: "rgba(255,255,255,0.22)",
                  color: "#f8fafc",
                  borderRadius: 999,
                  px: 2.25,
                  minHeight: 44,
                  textTransform: "none"
                }}
              >
                Cart
              </Button>

              <Button
                onClick={handleProfileMenuOpen}
                startIcon={
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: "#f97316",
                      color: "#111827",
                      fontSize: 14,
                      fontWeight: 800
                    }}
                  >
                    {(user?.name || "C").slice(0, 1).toUpperCase()}
                  </Avatar>
                }
                endIcon={<ExpandMoreRoundedIcon />}
                sx={{
                  borderRadius: 999,
                  color: "#f8fafc",
                  textTransform: "none",
                  px: 1.5,
                  minHeight: 44,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)"
                  }
                }}
              >
                {user?.name || "Customer"}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            border: "1px solid rgba(245,158,11,0.24)",
            background: "linear-gradient(180deg, rgba(13,13,16,0.98), rgba(9,9,11,0.98))",
            boxShadow: "0 28px 60px rgba(0,0,0,0.35)",
            p: { xs: 2, md: 3 }
          }}
        >
          <Box
            sx={{
              border: "4px solid #d97706",
              borderRadius: 4,
              p: { xs: 2, md: 3 }
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                sx={{
                  fontSize: { xs: 36, md: 52 },
                  fontWeight: 900,
                  letterSpacing: 3,
                  color: "#ffffff"
                }}
              >
                HAIRSALON
              </Typography>
              <Typography sx={{ fontSize: { xs: 16, md: 22 }, letterSpacing: 4, color: "#e5e7eb" }}>
                MENS
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: { xs: 2, md: 2.5 },
                borderRadius: 4,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background:
                        "linear-gradient(180deg, rgba(249,115,22,0.16), rgba(0,0,0,0.55))"
                    }}
                  >
                    <Box
                      component="img"
                      src={previewImage}
                      alt={currentCategory.type}
                      sx={{
                        width: "100%",
                        height: { xs: 220, md: 260 },
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                    <Box sx={{ p: 2.5 }}>
                      <Typography sx={{ color: "#f59e0b", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                        Featured Service
                      </Typography>
                      <Typography sx={{ fontSize: 28, fontWeight: 900, mt: 0.5, color: "#ffffff" }}>
                        {displayedService.name}
                      </Typography>
                      <Typography sx={{ color: "rgba(248,250,252,0.78)", mt: 1, lineHeight: 1.8 }}>
                        {currentCategory.subtitle}
                      </Typography>
                      <Typography sx={{ color: "#fbbf24", fontSize: 24, fontWeight: 900, mt: 2 }}>
                        Rs. {displayedService.price}
                      </Typography>
                      <Typography sx={{ color: "rgba(248,250,252,0.7)", fontSize: 13, mt: 0.5 }}>
                        {displayedService.subtitle}
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AddShoppingCartRoundedIcon />}
                        onClick={() => addToCart(displayedService, currentCategory.type)}
                        sx={{
                          mt: 2,
                          py: 1.4,
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #f97316, #fbbf24)",
                          color: "#111827"
                        }}
                      >
                        Add selected service
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Service Type"
                      value={selectedType}
                      onChange={selectCategory}
                      InputLabelProps={{
                        sx: {
                          color: "#f8fafc",
                          "&.Mui-focused": { color: "#fbbf24" }
                        }
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            sx: {
                              mt: 1,
                              background: "#111827",
                              color: "#f8fafc",
                              border: "1px solid rgba(255,255,255,0.1)",
                              "& .MuiMenuItem-root": {
                                color: "#f8fafc"
                              }
                            }
                          }
                        }
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(255,255,255,0.05)",
                          color: "#f8fafc",
                          borderRadius: 2.5,
                          "& fieldset": {
                            borderColor: "rgba(59,130,246,0.9)"
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(59,130,246,1)"
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#fbbf24"
                          }
                        },
                        "& .MuiSelect-icon": {
                          color: "#f8fafc"
                        }
                      }}
                    >
                      {serviceCatalog.map((category) => (
                        <MenuItem key={category.type} value={category.type}>
                          {category.type}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Typography sx={{ color: "rgba(248,250,252,0.72)" }}>
                      {currentCategory.subtitle}
                    </Typography>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, minmax(0, 1fr))"
                        },
                        gap: 1.5,
                        alignItems: "stretch"
                      }}
                    >
                      {currentCategory.items.map((item) => {
                        const isActive = item.name === displayedService.name;

                        return (
                          <Card
                            key={`${currentCategory.type}-${item.name}`}
                            elevation={0}
                            onClick={() => setSelectedService(item)}
                            sx={{
                              cursor: "pointer",
                              overflow: "hidden",
                              borderRadius: 3,
                              background: isActive
                                ? "linear-gradient(180deg, rgba(249,115,22,0.18), rgba(255,255,255,0.04))"
                                : "rgba(255,255,255,0.03)",
                              border: isActive
                                ? "1px solid rgba(249,115,22,0.6)"
                                : "1px solid rgba(255,255,255,0.08)",
                              color: "#f8fafc",
                              display: "flex",
                              minHeight: 112,
                              transition: "transform 180ms ease, border-color 180ms ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                borderColor: "rgba(251,191,36,0.65)"
                              }
                            }}
                          >
                            <CardContent
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "92px 1fr",
                                gap: 1.5,
                                width: "100%",
                                alignItems: "center",
                                p: 1.5,
                                "&:last-child": { pb: 1.5 }
                              }}
                            >
                              <Box
                                component="img"
                                src={
                                  item.image ||
                                  currentCategory.image ||
                                  getSalonImage(
                                    serviceCatalog.findIndex(
                                      (entry) => entry.type === currentCategory.type
                                    ) +
                                      currentCategory.items.findIndex(
                                        (entry) => entry.name === item.name
                                      ) +
                                      1
                                  )
                                }
                                alt={item.name}
                                sx={{
                                  width: 92,
                                  height: 92,
                                  borderRadius: 2,
                                  objectFit: "cover",
                                  display: "block"
                                }}
                              />

                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontSize: 16,
                                    fontWeight: 800,
                                    lineHeight: 1.2,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                <Typography sx={{ color: "rgba(248,250,252,0.72)", fontSize: 13, mt: 0.5 }}>
                                  {item.subtitle}
                                </Typography>
                                <Typography sx={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, mt: 1 }}>
                                  Rs. {item.price}
                                </Typography>

                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<AddShoppingCartRoundedIcon />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(item, currentCategory.type);
                                  }}
                                  sx={{
                                    mt: 1.2,
                                    borderRadius: 999,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, #f97316, #fbbf24)",
                                    color: "#111827",
                                    "&:hover": {
                                      background: "linear-gradient(135deg, #ea580c, #f59e0b)"
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Paper>
      </Box>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 440 },
            maxWidth: "100%",
            background:
              "linear-gradient(180deg, rgba(17,24,39,0.98), rgba(9,9,11,0.98))",
            color: "#f8fafc",
            borderLeft: "2px solid rgba(251,191,36,0.34)",
            boxShadow: "-20px 0 60px rgba(0,0,0,0.45)"
          }
        }}
      >
        <Box
          sx={{
            m: 1.5,
            p: 2.5,
            height: "calc(100% - 24px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            border: "1px solid rgba(251,191,36,0.18)",
            background: "rgba(255,255,255,0.02)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pb: 2,
              borderBottom: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "#fbbf24" }}>
                Your Cart
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#f8fafc" }}>
                Appointment cart
              </Typography>
            </Box>
            <IconButton onClick={() => setCartOpen(false)} sx={{ color: "#f8fafc" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Typography sx={{ color: "rgba(248,250,252,0.7)", mb: 2 }}>
            Hello {user?.name || "Customer"}, review your selected services before booking.
          </Typography>

          <TextField
            select
            fullWidth
            label="Select owner"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.05)",
                color: "#f8fafc",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.15)"
                },
                "&:hover fieldset": {
                  borderColor: "rgba(251,191,36,0.5)"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fbbf24"
                }
              },
              "& .MuiInputLabel-root": {
                color: "rgba(248,250,252,0.72)"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#fbbf24"
              },
              "& .MuiSelect-icon": {
                color: "#f8fafc"
              }
            }}
            InputLabelProps={{
              sx: { color: "rgba(248,250,252,0.72)" }
            }}
          >
            {owners.map((owner) => (
              <MenuItem key={owner._id} value={owner._id}>
                {owner.name}
              </MenuItem>
            ))}
          </TextField>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Booking date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minimumDate }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.05)",
                    color: "#f8fafc",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.15)"
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(251,191,36,0.5)"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fbbf24"
                    }
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(248,250,252,0.72)"
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fbbf24"
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Time slot"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.05)",
                    color: "#f8fafc",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.15)"
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(251,191,36,0.5)"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fbbf24"
                    }
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(248,250,252,0.72)"
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#fbbf24"
                  },
                  "& .MuiSelect-icon": {
                    color: "#f8fafc"
                  }
                }}
              >
                {timeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(251,191,36,0.18)",
              mb: 2,
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <StorefrontRoundedIcon sx={{ color: "#fbbf24" }} />
              <Typography sx={{ fontWeight: 800, color: "#f8fafc" }}>
                Selected services
              </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto" }}>
              <List sx={{ py: 0 }}>
                {cart.map((item, index) => (
                  <ListItem
                    key={`${item.name}-${index}`}
                    disableGutters
                    secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => removeItem(index)}>
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    }
                    sx={{ pr: 6 }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.category} - Rs. ${item.price}`}
                      primaryTypographyProps={{ fontWeight: 700, color: "#f8fafc" }}
                      secondaryTypographyProps={{ color: "rgba(248,250,252,0.7)" }}
                    />
                  </ListItem>
                ))}

                {!cart.length && (
                  <Typography sx={{ color: "rgba(248,250,252,0.65)", py: 1 }}>
                    No service added yet. Tap "Add" from the menu.
                  </Typography>
                )}
              </List>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography sx={{ color: "rgba(248,250,252,0.72)" }}>Items in cart</Typography>
            <Chip
              label={cart.length}
              sx={{
                fontWeight: 700,
                background: "rgba(251,191,36,0.14)",
                color: "#fbbf24"
              }}
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>
              Total amount
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#fbbf24" }}>
              Rs. {total}
            </Typography>
          </Stack>

          <Button
            fullWidth
            variant="contained"
            onClick={handleBooking}
            sx={{
              py: 1.5,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 800,
              fontSize: 16,
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
              color: "#111827",
              boxShadow: "0 18px 32px rgba(249,115,22,0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #ea580c, #f59e0b)"
              }
            }}
          >
            Book appointment
          </Button>
        </Box>
      </Drawer>

      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 250,
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 800, color: "#334155" }}>Your Account</Typography>
          <Typography sx={{ fontSize: 13, color: "#64748b" }}>
            {user?.name || "Customer"}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleProfileAction("profile")} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={() => handleProfileAction("bookings")} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <ReceiptLongRoundedIcon fontSize="small" />
          </ListItemIcon>
          My Bookings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleProfileAction("logout")} sx={{ py: 1.2, color: "#b91c1c" }}>
          <ListItemIcon sx={{ color: "inherit" }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CustomerDashboard;
