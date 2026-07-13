const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets from stitch_pathsense_accessibility_navigator directory
app.use(express.static(path.join(__dirname, 'stitch_pathsense_accessibility_navigator')));

// ─── DATA MODEL ────────────────────────────────────────────────

// Disability categories and their sub-criteria
const DISABILITY_CATEGORIES = {
  wheelchair: {
    label: "Wheelchair / Mobility Impairments",
    icon: "accessible",
    criteria: [
      { key: "ramps", label: "Ramps & Elevator Availability" },
      { key: "door_width", label: "Door Width" },
      { key: "accessible_restroom", label: "Accessible Restroom" },
      { key: "surface_quality", label: "Surface Quality" },
      { key: "crowdedness", label: "Crowdedness" }
    ]
  },
  cane_walker: {
    label: "Canes, Walkers, or Crutches",
    icon: "elderly",
    criteria: [
      { key: "stairs", label: "Number of Stairs" },
      { key: "handrails", label: "Handrails" },
      { key: "rest_places", label: "Places to Rest" },
      { key: "steep_inclines", label: "Steep Inclines" }
    ]
  },
  blind: {
    label: "Blind or Low-Vision",
    icon: "visibility",
    criteria: [
      { key: "lighting", label: "Lighting Quality" },
      { key: "tactile_paving", label: "Tactile Paving" },
      { key: "braille_signs", label: "Braille Signs" },
      { key: "high_contrast_signage", label: "High-Contrast Signage" },
      { key: "audio_announcements", label: "Audio Announcements" },
      { key: "clear_paths", label: "Clear Paths Without Obstacles" },
      { key: "staff_assistance", label: "Staff Assistance" },
      { key: "guide_dog_friendly", label: "Guide Dog Friendliness" }
    ]
  },
  deaf: {
    label: "Deaf or Hard-of-Hearing",
    icon: "hearing_disabled",
    criteria: [
      { key: "visual_announcements", label: "Visual Announcements" },
      { key: "sign_language", label: "Sign Language Availability" },
      { key: "staff_communication", label: "Staff Communication Methods" },
      { key: "emergency_visual_alarms", label: "Emergency Visual Alarms" }
    ]
  },
  autism: {
    label: "Autism / Sensory Sensitivities",
    icon: "psychology",
    criteria: [
      { key: "noise_level", label: "Noise Level" },
      { key: "crowd_density", label: "Crowd Density" },
      { key: "flashing_lights", label: "Bright/Flashing Lights" },
      { key: "strong_smells", label: "Strong Smells" },
      { key: "quiet_spaces", label: "Quiet Spaces" },
      { key: "predictable_layout", label: "Predictable Layout" },
      { key: "waiting_times", label: "Waiting Times" }
    ]
  },
  anxiety: {
    label: "Anxiety / PTSD",
    icon: "self_improvement",
    criteria: [
      { key: "crowdedness_anxiety", label: "Crowdedness" },
      { key: "noise_anxiety", label: "Noise" },
      { key: "quiet_areas", label: "Availability of Quiet Areas" },
      { key: "security_presence", label: "Security Presence" }
    ]
  },
  chronic_pain: {
    label: "Chronic Pain or Fatigue",
    icon: "accessibility_new",
    criteria: [
      { key: "parking_distance", label: "Distance from Parking/Transport" },
      { key: "elevators_pain", label: "Elevators" },
      { key: "seating_frequency", label: "Seating Frequency" },
      { key: "waiting_times_pain", label: "Waiting Times" },
      { key: "restroom_availability", label: "Restroom Availability" }
    ]
  }
};

// User profile
let userProfile = {
  name: "Sarah",
  fullName: "Sarah Jenkins",
  email: "sarah.jenkins@example.com",
  memberSince: "June 2023",
  role: "Community Guide",
  points: 128,
  reviewsGiven: 24,
  alertsSent: 15,
  categories: ["wheelchair"],
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT2rrkFwZmpBSsfdhQHsH0GIrc-uCGBV-aRkpQuOikULbDbQ6VnAS4CzuPQ27iPaJzvMswsbUiice-yszUcqA0s2oZ8dsjH91pGvyixjUduTqRQ4b7E1gEO8MMa7rEzFMtuAfdx9TAcPurcs5SnZwH-nBHw7ucNYMVk-x5jq353C-SN1T67gxNOsoRIA8d0Hmzk21G18ZECwCTu8TyEX57nPX0HwKP61usUcZfh5dQT6FFA14CrJep"
};

// Places database with detailed accessibility ratings
let localPlaces = [
  {
    id: "central_library",
    name: "Central Public Library",
    address: "200 Main St, Downtown Chicago",
    coords: [41.8841, -87.6328],
    lat: 41.8841,
    lng: -87.6328,
    category: "Cultural Center",
    rating: 4.8,
    distance: "0.3 miles",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQBpHdYBAJkQJ8Fdl1BNRlWgT2TQ0I0qEUAiF-AXgIqEGrkAkCWcXMwCQB0R7JCQ4ZFJ26WN93khCo189EoD19HB1GJT5Q6Y7ADWhrVJa0aywfWppHpFw4j4cpzDADOKZFHiaqz-TH--X7_MM0kOFyQZKMX8rF5ifIvVIIvpp7FvBgzCPPuB_1d9HAuC0Y5euyH8028SRdktdJ3RKSBCukrgVlx-I6zBNJymJIBJ1NzhOSJlzdwEms",
    features: {
      step_free: true, elevator: true, accessible_toilet: true,
      braille_signage: true, quiet_zones: true, accessible_parking: false
    },
    ratings: {
      wheelchair: { ramps: 5, door_width: 4, accessible_restroom: 5, surface_quality: 4, crowdedness: 3 },
      cane_walker: { stairs: 4, handrails: 5, rest_places: 4, steep_inclines: 5 },
      blind: { lighting: 4, tactile_paving: 3, braille_signs: 4, high_contrast_signage: 4, audio_announcements: 3, clear_paths: 5, staff_assistance: 5, guide_dog_friendly: 5 },
      deaf: { visual_announcements: 3, sign_language: 2, staff_communication: 4, emergency_visual_alarms: 4 },
      autism: { noise_level: 4, crowd_density: 3, flashing_lights: 5, strong_smells: 5, quiet_spaces: 5, predictable_layout: 4, waiting_times: 4 },
      anxiety: { crowdedness_anxiety: 3, noise_anxiety: 4, quiet_areas: 5, security_presence: 4 },
      chronic_pain: { parking_distance: 3, elevators_pain: 5, seating_frequency: 4, waiting_times_pain: 3, restroom_availability: 5 }
    }
  },
  {
    id: "modern_brew",
    name: "Modern Brew Coffee",
    address: "42 Oak Avenue, Chicago",
    coords: [41.8755, -87.6244],
    lat: 41.8755,
    lng: -87.6244,
    category: "Cafe",
    rating: 4.2,
    distance: "0.1 miles",
    image: "",
    features: {
      step_free: true, elevator: false, accessible_toilet: false,
      braille_signage: false, quiet_zones: true, accessible_parking: false
    },
    ratings: {
      wheelchair: { ramps: 4, door_width: 3, accessible_restroom: 2, surface_quality: 4, crowdedness: 3 },
      cane_walker: { stairs: 5, handrails: 3, rest_places: 3, steep_inclines: 5 },
      blind: { lighting: 5, tactile_paving: 1, braille_signs: 1, high_contrast_signage: 3, audio_announcements: 1, clear_paths: 4, staff_assistance: 4, guide_dog_friendly: 4 },
      deaf: { visual_announcements: 2, sign_language: 1, staff_communication: 3, emergency_visual_alarms: 2 },
      autism: { noise_level: 3, crowd_density: 3, flashing_lights: 4, strong_smells: 2, quiet_spaces: 3, predictable_layout: 4, waiting_times: 3 },
      anxiety: { crowdedness_anxiety: 3, noise_anxiety: 3, quiet_areas: 3, security_presence: 2 },
      chronic_pain: { parking_distance: 4, elevators_pain: 2, seating_frequency: 4, waiting_times_pain: 3, restroom_availability: 2 }
    }
  },
  {
    id: "westside_plaza",
    name: "Westside Plaza",
    address: "800 West Jackson Blvd, Chicago",
    coords: [41.8680, -87.6355],
    lat: 41.8680,
    lng: -87.6355,
    category: "Mall",
    rating: 4.5,
    distance: "0.8 miles",
    image: "",
    features: {
      step_free: true, elevator: true, accessible_toilet: true,
      braille_signage: false, quiet_zones: false, accessible_parking: true
    },
    ratings: {
      wheelchair: { ramps: 5, door_width: 5, accessible_restroom: 4, surface_quality: 5, crowdedness: 2 },
      cane_walker: { stairs: 3, handrails: 4, rest_places: 5, steep_inclines: 4 },
      blind: { lighting: 4, tactile_paving: 2, braille_signs: 2, high_contrast_signage: 3, audio_announcements: 2, clear_paths: 3, staff_assistance: 3, guide_dog_friendly: 3 },
      deaf: { visual_announcements: 4, sign_language: 2, staff_communication: 3, emergency_visual_alarms: 5 },
      autism: { noise_level: 2, crowd_density: 2, flashing_lights: 2, strong_smells: 3, quiet_spaces: 2, predictable_layout: 4, waiting_times: 2 },
      anxiety: { crowdedness_anxiety: 2, noise_anxiety: 2, quiet_areas: 2, security_presence: 5 },
      chronic_pain: { parking_distance: 5, elevators_pain: 5, seating_frequency: 5, waiting_times_pain: 2, restroom_availability: 4 }
    }
  },
  {
    id: "downtown_transit",
    name: "Downtown Transit Center",
    address: "100 Transit Way, Chicago",
    coords: [41.8810, -87.6290],
    lat: 41.8810,
    lng: -87.6290,
    category: "Station",
    rating: 3.9,
    distance: "0.5 miles",
    image: "",
    features: {
      step_free: true, elevator: true, accessible_toilet: true,
      braille_signage: true, quiet_zones: false, accessible_parking: false
    },
    ratings: {
      wheelchair: { ramps: 4, door_width: 5, accessible_restroom: 3, surface_quality: 4, crowdedness: 1 },
      cane_walker: { stairs: 4, handrails: 5, rest_places: 2, steep_inclines: 4 },
      blind: { lighting: 5, tactile_paving: 5, braille_signs: 4, high_contrast_signage: 4, audio_announcements: 5, clear_paths: 3, staff_assistance: 2, guide_dog_friendly: 3 },
      deaf: { visual_announcements: 5, sign_language: 1, staff_communication: 2, emergency_visual_alarms: 5 },
      autism: { noise_level: 1, crowd_density: 1, flashing_lights: 3, strong_smells: 3, quiet_spaces: 1, predictable_layout: 3, waiting_times: 2 },
      anxiety: { crowdedness_anxiety: 1, noise_anxiety: 1, quiet_areas: 1, security_presence: 4 },
      chronic_pain: { parking_distance: 2, elevators_pain: 4, seating_frequency: 2, waiting_times_pain: 2, restroom_availability: 3 }
    }
  },
  {
    id: "lakeside_park",
    name: "Lakeside Park",
    address: "Lake Shore Drive, Chicago",
    coords: [41.8700, -87.6180],
    lat: 41.8700,
    lng: -87.6180,
    category: "Park",
    rating: 4.9,
    distance: "1.2 miles",
    image: "",
    features: {
      step_free: true, elevator: false, accessible_toilet: true,
      braille_signage: false, quiet_zones: true, accessible_parking: true
    },
    ratings: {
      wheelchair: { ramps: 5, door_width: 5, accessible_restroom: 4, surface_quality: 5, crowdedness: 4 },
      cane_walker: { stairs: 5, handrails: 3, rest_places: 5, steep_inclines: 4 },
      blind: { lighting: 2, tactile_paving: 1, braille_signs: 1, high_contrast_signage: 1, audio_announcements: 1, clear_paths: 4, staff_assistance: 1, guide_dog_friendly: 5 },
      deaf: { visual_announcements: 1, sign_language: 1, staff_communication: 1, emergency_visual_alarms: 1 },
      autism: { noise_level: 5, crowd_density: 4, flashing_lights: 5, strong_smells: 5, quiet_spaces: 5, predictable_layout: 4, waiting_times: 5 },
      anxiety: { crowdedness_anxiety: 4, noise_anxiety: 5, quiet_areas: 5, security_presence: 3 },
      chronic_pain: { parking_distance: 4, elevators_pain: 5, seating_frequency: 5, waiting_times_pain: 5, restroom_availability: 3 }
    }
  }
];

// Reviews database
let localReviews = {
  central_library: [
    {
      id: 1,
      userName: "Sarah Jenkins",
      userType: "Wheelchair User",
      timeAgo: "2 days ago",
      overallRating: 5,
      text: "The automatic doors are incredibly responsive and stay open long enough for my power chair. The sensory room on the 3rd floor was a lifesaver during a busy event. Highly recommend for anyone with mobility needs!",
      helpful: 24,
      categoryRatings: { wheelchair: { ramps: 5, door_width: 5, accessible_restroom: 5, surface_quality: 4, crowdedness: 3 } }
    },
    {
      id: 2,
      userName: "Marcus Chen",
      userType: "Low Vision",
      timeAgo: "1 week ago",
      overallRating: 4,
      text: "Excellent high-contrast signage throughout. The audio-guided navigation app works perfectly here. Just wish the lighting in the back study area was a bit more consistent.",
      helpful: 12,
      categoryRatings: { blind: { lighting: 4, braille_signs: 4, high_contrast_signage: 5, clear_paths: 5 } }
    }
  ],
  modern_brew: [
    {
      id: 3,
      userName: "Emily Torres",
      userType: "Autism / Sensory",
      timeAgo: "3 days ago",
      overallRating: 3,
      text: "The quiet corner seating is great, but during morning rush it gets very noisy and crowded. The coffee grinder can be startling. Recommend visiting after 2pm.",
      helpful: 8,
      categoryRatings: { autism: { noise_level: 2, crowd_density: 2, quiet_spaces: 4, waiting_times: 3 } }
    }
  ],
  westside_plaza: [
    {
      id: 4,
      userName: "David Park",
      userType: "Wheelchair User",
      timeAgo: "5 days ago",
      overallRating: 4,
      text: "Great elevator access and wide corridors. The accessible parking is very close to the main entrance. Only issue is the food court gets extremely crowded on weekends.",
      helpful: 15,
      categoryRatings: { wheelchair: { ramps: 5, door_width: 5, accessible_restroom: 4, crowdedness: 2 } }
    }
  ],
  downtown_transit: [
    {
      id: 5,
      userName: "Alex Johnson",
      userType: "Wheelchair User",
      timeAgo: "1 day ago",
      overallRating: 3,
      text: "The main elevators are usually working, but it gets incredibly crowded during rush hour, making it hard to navigate a wheelchair to the platform. The accessible restrooms are often locked or dirty.",
      helpful: 42,
      categoryRatings: { wheelchair: { ramps: 4, door_width: 4, accessible_restroom: 2, surface_quality: 4, crowdedness: 1 } }
    },
    {
      id: 6,
      userName: "Maria Garcia",
      userType: "Mobility Impaired",
      timeAgo: "3 days ago",
      overallRating: 4,
      text: "Good ramp access from the street level. Handrails are sturdy. I just wish there were more benches while waiting for the buses.",
      helpful: 18,
      categoryRatings: { cane_walker: { stairs: 4, handrails: 5, rest_places: 2, steep_inclines: 4 } }
    }
  ],
  lakeside_park: [
    {
      id: 7,
      userName: "Sam Taylor",
      userType: "Wheelchair User",
      timeAgo: "4 hours ago",
      overallRating: 5,
      text: "Incredible paved paths that are perfectly smooth and wide. The accessible parking is right next to the main paved loop. Great place for a roll!",
      helpful: 55,
      categoryRatings: { wheelchair: { ramps: 5, door_width: 5, accessible_restroom: 4, surface_quality: 5, crowdedness: 4 } }
    },
    {
      id: 8,
      userName: "Chris Evans",
      userType: "Wheelchair User",
      timeAgo: "1 week ago",
      overallRating: 5,
      text: "They recently updated the curb cuts around the entire park perimeter. It's flawless now. Highly recommend the south gardens.",
      helpful: 23,
      categoryRatings: { wheelchair: { ramps: 5, surface_quality: 5 } }
    }
  ]
};

// Community reports database
let localReports = [
  {
    id: 1,
    title: "Elevator Out: Central Station North Exit",
    description: "The main elevator serving the North exit at Central Station is currently non-functional. Technicians are on site, but no ETR given.",
    issue_type: "High Severity",
    reported_by: "Sarah Jenkins",
    time_ago: "2 mins ago",
    upvotes: 12,
    verifications: 12,
    comments: 2,
    distance: "0.2 mi away",
    category: "Broken Elevators",
    status: "active",
    location: "Central Station North Exit"
  },
  {
    id: 2,
    title: "Temporary Sidewalk Closure",
    description: "Construction crew has blocked the East side of 5th Ave between Maple and Pine. No temporary ramp provided for crossing.",
    issue_type: "Medium Severity",
    reported_by: "Alex River",
    time_ago: "15 mins ago",
    upvotes: 8,
    verifications: 8,
    comments: 0,
    distance: "1.4 mi away",
    category: "Roadblocks",
    status: "active",
    location: "5th Ave & Maple St"
  },
  {
    id: 3,
    title: "Uneven Pavement",
    description: "Large cracks and uneven pavement on the bike path near the park entrance. Use caution with small-wheeled mobility devices.",
    issue_type: "Low Severity",
    reported_by: "Jamie Vance",
    time_ago: "1 hour ago",
    upvotes: 4,
    verifications: 4,
    comments: 0,
    distance: "3.1 mi away",
    category: "Potholes",
    status: "active",
    location: "Lincoln Park Entrance"
  }
];

// ─── HELPERS ───────────────────────────────────────────────────

function calculateScoresForPlaces(profileCategories) {
  return localPlaces.map(place => {
    if (!profileCategories || profileCategories.length === 0) {
      return { ...place, score: 100 };
    }

    let totalSum = 0;
    let totalCount = 0;

    profileCategories.forEach(cat => {
      const catDef = DISABILITY_CATEGORIES[cat];
      const placeRatings = place.ratings[cat];
      if (catDef && placeRatings) {
        catDef.criteria.forEach(criterion => {
          if (placeRatings[criterion.key] !== undefined) {
            totalSum += placeRatings[criterion.key];
            totalCount++;
          }
        });
      }
    });

    const score = totalCount > 0 ? Math.round((totalSum / (totalCount * 5)) * 100) : 100;
    return { ...place, score };
  });
}

function getOverallCategoryAvg(placeRatings, catKey) {
  const catDef = DISABILITY_CATEGORIES[catKey];
  const ratings = placeRatings[catKey];
  if (!catDef || !ratings) return 0;
  let sum = 0, count = 0;
  catDef.criteria.forEach(c => {
    if (ratings[c.key] !== undefined) { sum += ratings[c.key]; count++; }
  });
  return count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
}

// ─── API ROUTES ────────────────────────────────────────────────

// Disability categories metadata
app.get('/api/categories', (req, res) => {
  res.json(DISABILITY_CATEGORIES);
});

// User Profile
app.get('/api/profile', (req, res) => {
  res.json(userProfile);
});

app.post('/api/profile', (req, res) => {
  const updates = req.body;
  if (updates.categories && Array.isArray(updates.categories)) {
    userProfile.categories = updates.categories;
  }
  if (updates.name) userProfile.name = updates.name;
  if (updates.fullName) userProfile.fullName = updates.fullName;
  if (updates.email) userProfile.email = updates.email;
  res.json({ success: true, profile: userProfile });
});

// Places
app.get('/api/places', (req, res) => {
  const scoredPlaces = calculateScoresForPlaces(userProfile.categories);
  // Sort by score descending
  scoredPlaces.sort((a, b) => b.score - a.score);
  res.json(scoredPlaces);
});

app.get('/api/places/:id', (req, res) => {
  const scoredPlaces = calculateScoresForPlaces(userProfile.categories);
  const place = scoredPlaces.find(p => p.id === req.params.id);
  if (place) {
    // Include category averages
    const categoryAverages = {};
    Object.keys(DISABILITY_CATEGORIES).forEach(cat => {
      categoryAverages[cat] = getOverallCategoryAvg(place.ratings, cat);
    });
    res.json({ ...place, categoryAverages });
  } else {
    res.status(404).json({ error: 'Place not found' });
  }
});

// Reviews
app.get('/api/reviews/:placeId', (req, res) => {
  const reviews = localReviews[req.params.placeId] || [];
  res.json(reviews);
});

app.post('/api/reviews/:placeId', (req, res) => {
  const placeId = req.params.placeId;
  const { userName, userType, overallRating, text, categoryRatings } = req.body;

  if (!localReviews[placeId]) {
    localReviews[placeId] = [];
  }

  const newReview = {
    id: Date.now(),
    userName: userName || userProfile.fullName || "Anonymous",
    userType: userType || "Community Member",
    timeAgo: "Just now",
    overallRating: overallRating || 3,
    text: text || "",
    helpful: 0,
    categoryRatings: categoryRatings || {}
  };

  localReviews[placeId].unshift(newReview);

  // Update place aggregate ratings based on review
  const place = localPlaces.find(p => p.id === placeId);
  if (place && categoryRatings) {
    Object.keys(categoryRatings).forEach(cat => {
      if (place.ratings[cat]) {
        Object.keys(categoryRatings[cat]).forEach(criterion => {
          const newVal = categoryRatings[cat][criterion];
          if (typeof newVal === 'number' && newVal >= 1 && newVal <= 5) {
            // Simple average blend
            const oldVal = place.ratings[cat][criterion] || 3;
            place.ratings[cat][criterion] = Math.round(((oldVal + newVal) / 2) * 10) / 10;
          }
        });
      }
    });
  }

  userProfile.reviewsGiven++;
  res.json({ success: true, review: newReview });
});

// Helpful vote
app.post('/api/reviews/:placeId/:reviewId/helpful', (req, res) => {
  const reviews = localReviews[req.params.placeId];
  if (reviews) {
    const review = reviews.find(r => r.id === parseInt(req.params.reviewId));
    if (review) {
      review.helpful++;
      return res.json({ success: true, helpful: review.helpful });
    }
  }
  res.status(404).json({ error: 'Review not found' });
});

// Community Reports
app.get('/api/reports', (req, res) => {
  const { category, status } = req.query;
  let filtered = localReports;
  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category === category);
  }
  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }
  res.json(filtered);
});

app.post('/api/reports', (req, res) => {
  const { title, description, issue_type, reported_by, category, location } = req.body;
  const newReport = {
    id: Date.now(),
    title: title || "Accessibility Issue",
    description: description || "No description provided.",
    issue_type: issue_type || "Medium Severity",
    reported_by: reported_by || userProfile.fullName || "Anonymous",
    time_ago: "Just now",
    upvotes: 0,
    verifications: 0,
    comments: 0,
    distance: "Nearby",
    category: category || "Other",
    status: "active",
    location: location || "Unknown"
  };
  localReports.unshift(newReport);
  userProfile.alertsSent++;
  res.json({ success: true, report: newReport });
});

app.post('/api/reports/:id/verify', (req, res) => {
  const report = localReports.find(r => r.id === parseInt(req.params.id));
  if (report) {
    report.verifications = (report.verifications || 0) + 1;
    report.upvotes = (report.upvotes || 0) + 1;
    return res.json({ success: true, report });
  }
  res.status(404).json({ error: 'Report not found' });
});

app.post('/api/reports/:id/resolve', (req, res) => {
  const report = localReports.find(r => r.id === parseInt(req.params.id));
  if (report) {
    report.status = "resolved";
    return res.json({ success: true, report });
  }
  res.status(404).json({ error: 'Report not found' });
});

// Default catch-all to home page
app.get('/', (req, res) => {
  res.redirect('/pathsense_accessibility_navigator.html');
});

// Start Server
app.listen(PORT, () => {
  console.log(`PathSense Server listening at http://localhost:${PORT}`);
});
