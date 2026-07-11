const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets from stitch_pathsense_accessibility_navigator directory
app.use(express.static(path.join(__dirname, 'stitch_pathsense_accessibility_navigator')));

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized successfully.');
} else {
  console.log('No Supabase credentials detected. Operating in Local Mock Database fallback mode.');
}

// Local mock database
let activeProfile = ['wheelchair']; // Default active category matching front-end

let localPlaces = [
  {
    id: "central_library",
    name: "Central Public Library",
    coords: [41.8841, -87.6328],
    lat: 41.8841,
    lng: -87.6328,
    category: "Cultural Center",
    rating: 4.8,
    distance: "0.3 miles",
    features: {
      step_free: true,
      elevator: true,
      accessible_toilet: true,
      braille_signage: true,
      quiet_zones: true,
      accessible_parking: false
    }
  },
  {
    id: "modern_brew",
    name: "Modern Brew Coffee",
    coords: [41.8755, -87.6244],
    lat: 41.8755,
    lng: -87.6244,
    category: "Cafe",
    rating: 4.2,
    distance: "0.1 miles",
    features: {
      step_free: true,
      elevator: false,
      accessible_toilet: false,
      braille_signage: false,
      quiet_zones: true,
      accessible_parking: false
    }
  },
  {
    id: "westside_plaza",
    name: "Westside Plaza",
    coords: [41.8680, -87.6355],
    lat: 41.8680,
    lng: -87.6355,
    category: "Mall",
    rating: 4.5,
    distance: "0.8 miles",
    features: {
      step_free: true,
      elevator: true,
      accessible_toilet: true,
      braille_signage: false,
      quiet_zones: false,
      accessible_parking: true
    }
  }
];

let localReports = [
  {
    id: 1,
    title: "Elevator Out: Central Station North Exit",
    description: "The main elevator serving the North exit at Central Station is currently non-functional. Technicians are on site, but no ETR given.",
    issue_type: "High Severity",
    reported_by: "Sarah Jenkins",
    time_ago: "2 mins ago",
    upvotes: 12,
    comments: 2,
    distance: "0.2 mi away",
    category: "Broken Elevators"
  },
  {
    id: 2,
    title: "Temporary Sidewalk Closure",
    description: "Construction crew has blocked the East side of 5th Ave between Maple and Pine. No temporary ramp provided for crossing.",
    issue_type: "Medium Severity",
    reported_by: "Alex River",
    time_ago: "15 mins ago",
    upvotes: 8,
    comments: 0,
    distance: "1.4 mi away",
    category: "Roadblocks"
  },
  {
    id: 3,
    title: "Uneven Pavement",
    description: "Large cracks and uneven pavement on the bike path near the park entrance. Use caution with small-wheeled mobility devices.",
    issue_type: "Low Severity",
    reported_by: "Jamie Vance",
    time_ago: "1 hour ago",
    upvotes: 4,
    comments: 0,
    distance: "3.1 mi away",
    category: "Potholes"
  }
];

// Helper to calculate accessibility match scores
function calculateScoresForPlaces(profileList) {
  return localPlaces.map(place => {
    // Generate the list of requirements based on active profile
    let required = [];
    if (profileList.includes('wheelchair') || profileList.includes('mobility')) {
      required.push('step_free', 'elevator', 'accessible_toilet', 'accessible_parking');
    }
    if (profileList.includes('blind') || profileList.includes('visual')) {
      required.push('braille_signage');
    }
    if (profileList.includes('autism') || profileList.includes('cognitive') || profileList.includes('sensory')) {
      required.push('quiet_zones');
    }

    if (required.length === 0) {
      return { ...place, score: 100 };
    }

    let metCount = 0;
    required.forEach(req => {
      if (place.features[req] === true) {
        metCount++;
      }
    });

    const score = Math.round((metCount / required.length) * 100);
    return { ...place, score };
  });
}

// API Routes

// User Profile Endpoint
app.get('/api/profile', (req, res) => {
  res.json({ categories: activeProfile });
});

app.post('/api/profile', (req, res) => {
  const { categories } = req.body;
  if (Array.isArray(categories)) {
    activeProfile = categories;
    res.json({ success: true, categories: activeProfile });
  } else {
    res.status(400).json({ success: false, error: 'Categories must be an array' });
  }
});

// Community Reports Endpoints
app.get('/api/reports', (req, res) => {
  res.json(localReports);
});

app.post('/api/reports', (req, res) => {
  const { title, description, issue_type, reported_by, category } = req.body;
  const newReport = {
    id: localReports.length + 1,
    title: title || "Accessibility Issue",
    description: description || "No description provided.",
    issue_type: issue_type || "Medium Severity",
    reported_by: reported_by || "Anonymous",
    time_ago: "Just now",
    upvotes: 0,
    comments: 0,
    distance: "Local",
    category: category || "Other"
  };
  localReports.unshift(newReport);
  res.json({ success: true, report: newReport });
});

// Places Endpoints
app.get('/api/places', (req, res) => {
  const scoredPlaces = calculateScoresForPlaces(activeProfile);
  res.json(scoredPlaces);
});

app.get('/api/places/:id', (req, res) => {
  const scoredPlaces = calculateScoresForPlaces(activeProfile);
  const place = scoredPlaces.find(p => p.id === req.params.id);
  if (place) {
    res.json(place);
  } else {
    res.status(404).json({ error: 'Place not found' });
  }
});

// Default catch-all to new home page
app.get('/', (req, res) => {
  res.redirect('/pathsense_accessibility_navigator.html');
});

// Start Server
app.listen(PORT, () => {
  console.log(`PathSense Server listening at http://localhost:${PORT}`);
});
