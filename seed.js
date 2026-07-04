#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

// Models
const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const facilitySchema = new mongoose.Schema({
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sport",
    required: true
  },
  name: { type: String, required: true },
  maxPlayers: { type: Number, required: true },
  allowedGender: {
    type: String,
    enum: ["male", "female", "both"],
    default: "both"
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Sport = mongoose.model('Sport', sportSchema);
const Facility = mongoose.model('Facility', facilitySchema);

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nitk-pool-booking');
    console.log(' Connected to MongoDB\n');

    // Clear existing sports and facilities
    console.log('  Clearing existing sports and facilities...');
    await Sport.deleteMany({});
    await Facility.deleteMany({});

    // Create sports
    console.log(' Creating sports...');
    const sportsData = [
      { name: 'Swimming' },
      { name: 'Tennis' },
      { name: 'Basketball' },
      { name: 'Badminton' }
    ];

    const createdSports = await Sport.insertMany(sportsData);
    console.log(`Created ${createdSports.length} sports:`);
    createdSports.forEach(sport => {
      console.log(`   - ${sport.name} (ID: ${sport._id})`);
    });

    // Create facilities
    console.log('\n Creating facilities');
    const facilitiesData = [
      {
        sport: createdSports.find(s => s.name === 'Swimming')._id,
        name: 'Swimming Pool',
        maxPlayers: 20,
        allowedGender: 'both',
        isActive: true
      },
      {
        sport: createdSports.find(s => s.name === 'Tennis')._id,
        name: 'Tennis Court',
        maxPlayers: 2,
        allowedGender: 'both',
        isActive: true
      },
      {
        sport: createdSports.find(s => s.name === 'Basketball')._id,
        name: 'Basketball Court',
        maxPlayers: 10,
        allowedGender: 'both',
        isActive: true
      },
      {
        sport: createdSports.find(s => s.name === 'Badminton')._id,
        name: 'Badminton Court',
        maxPlayers: 2,
        allowedGender: 'both',
        isActive: true
      }
    ];

    const createdFacilities = await Facility.insertMany(facilitiesData);
    console.log(` Created ${createdFacilities.length} facilities:`);
    createdFacilities.forEach(facility => {
      console.log(`   - ${facility.name} (Max Players: ${facility.maxPlayers})`);
    });

    console.log('\n Database seeded successfully!');
    console.log('\n Available Sports in Database:');
    const sports = await Sport.find({});
    sports.forEach(sport => {
      console.log(`   - ${sport.name}`);
    });

    console.log('\n You can now create slots for these sports!');

  } catch (error) {
    console.error(' Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n Disconnected from MongoDB');
  }
}

// Run the script
seedDatabase();
