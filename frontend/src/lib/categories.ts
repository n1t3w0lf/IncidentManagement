// ============================================
// INCIDENT CATEGORIES - ALL INDUSTRIES
// Complete list of 62 use cases
// ============================================

import { IncidentCategory } from '@/types';

// ============================================
// GENERAL CATEGORIES (Available to All)
// ============================================

const GENERAL_CATEGORIES: IncidentCategory[] = [
  {
    id: 'general_safety',
    name: 'General Safety Incident',
    description: 'Any safety-related incident or concern',
    type: 'corporate',
    requiresApproval: true,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['location', 'description'],
    customFields: []
  },
  {
    id: 'general_security',
    name: 'Security Incident',
    description: 'Security breaches or concerns',
    type: 'corporate',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['description'],
    customFields: []
  },
];

// ============================================
// MINING INDUSTRY (22 Categories)
// ============================================

const MINING_CATEGORIES: IncidentCategory[] = [
  {
    id: 'mining_equipment_fire',
    name: 'Underground Equipment Fire',
    description: 'Fire involving underground mining equipment',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['equipment_id', 'underground_location', 'personnel_evacuated'],
    customFields: [
      {
        id: 'equipment_id',
        name: 'Equipment ID/Type',
        type: 'text',
        required: true,
        placeholder: 'e.g., Loader #23, Drill Rig DR-05'
      },
      {
        id: 'underground_location',
        name: 'Underground Location',
        type: 'text',
        required: true,
        placeholder: 'Level, drift, stope number',
        helpText: 'Specify level, drift, and stope number'
      },
      {
        id: 'personnel_evacuated',
        name: 'Number of Personnel Evacuated',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'fire_suppression_method',
        name: 'Fire Suppression Method Used',
        type: 'select',
        required: true,
        options: ['Fire Extinguisher', 'Sprinkler System', 'Fire Hose', 'Foam System', 'Other']
      },
      {
        id: 'msha_notified',
        name: 'MSHA Notified',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_slip_fall',
    name: 'Slip/Trip/Fall with Injury',
    description: 'Worker slip, trip, or fall resulting in injury',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['injury_type', 'body_part', 'medical_treatment'],
    customFields: [
      {
        id: 'injury_type',
        name: 'Type of Injury',
        type: 'select',
        required: true,
        options: ['Laceration', 'Fracture', 'Sprain/Strain', 'Contusion', 'Head Injury', 'Other']
      },
      {
        id: 'body_part',
        name: 'Body Part Affected',
        type: 'select',
        required: true,
        options: ['Head', 'Eyes', 'Back', 'Arms/Hands', 'Legs/Feet', 'Chest', 'Multiple', 'Other']
      },
      {
        id: 'medical_treatment',
        name: 'Medical Treatment Required',
        type: 'select',
        required: true,
        options: ['First Aid Only', 'Clinic Visit', 'Hospital ER', 'Hospitalization', 'None']
      },
      {
        id: 'surface_condition',
        name: 'Surface Condition',
        type: 'select',
        required: false,
        options: ['Wet', 'Icy', 'Uneven', 'Debris Present', 'Good Condition', 'Other']
      },
      {
        id: 'ppe_worn',
        name: 'PPE Being Worn',
        type: 'multiselect',
        required: false,
        options: ['Hard Hat', 'Safety Boots', 'Gloves', 'Safety Glasses', 'High Vis Vest']
      }
    ]
  },
  {
    id: 'mining_haul_truck_collision',
    name: 'Haul Truck Collision',
    description: 'Collision involving haul trucks or heavy mobile equipment',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['vehicle_1', 'vehicle_2', 'injuries'],
    customFields: [
      {
        id: 'vehicle_1',
        name: 'Primary Vehicle/Equipment',
        type: 'text',
        required: true,
        placeholder: 'Haul Truck #45'
      },
      {
        id: 'vehicle_2',
        name: 'Secondary Vehicle/Equipment (if any)',
        type: 'text',
        required: false
      },
      {
        id: 'injuries',
        name: 'Injuries Sustained',
        type: 'select',
        required: true,
        options: ['No Injuries', 'Minor Injuries', 'Serious Injuries', 'Fatality']
      },
      {
        id: 'collision_type',
        name: 'Type of Collision',
        type: 'select',
        required: true,
        options: ['Head-on', 'Rear-end', 'Side-swipe', 'Backing', 'Rollover', 'Fixed Object', 'Other']
      },
      {
        id: 'speed_estimate',
        name: 'Estimated Speed at Impact (km/h)',
        type: 'number',
        required: false
      }
    ]
  },
  {
    id: 'mining_chemical_spill',
    name: 'Chemical Spill/Release',
    description: 'Uncontrolled release of hazardous chemicals',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['chemical_name', 'quantity_spilled', 'containment_status'],
    customFields: [
      {
        id: 'chemical_name',
        name: 'Chemical Name/SDS Reference',
        type: 'text',
        required: true
      },
      {
        id: 'quantity_spilled',
        name: 'Approximate Quantity Spilled',
        type: 'text',
        required: true,
        placeholder: 'e.g., 50 liters, 2 drums'
      },
      {
        id: 'containment_status',
        name: 'Containment Status',
        type: 'select',
        required: true,
        options: ['Contained', 'Partially Contained', 'Uncontained', 'Cleaned Up']
      },
      {
        id: 'environmental_impact',
        name: 'Environmental Impact',
        type: 'select',
        required: true,
        options: ['None', 'Soil Contamination', 'Water Contamination', 'Air Emission', 'Multiple', 'Unknown']
      },
      {
        id: 'personnel_exposure',
        name: 'Personnel Exposed',
        type: 'number',
        required: true,
        validation: { min: 0 }
      }
    ]
  },
  {
    id: 'mining_confined_space',
    name: 'Confined Space Emergency',
    description: 'Emergency or incident in confined space',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['confined_space_id', 'personnel_count', 'rescue_required'],
    customFields: [
      {
        id: 'confined_space_id',
        name: 'Confined Space ID/Location',
        type: 'text',
        required: true
      },
      {
        id: 'personnel_count',
        name: 'Number of Personnel Involved',
        type: 'number',
        required: true,
        validation: { min: 1 }
      },
      {
        id: 'rescue_required',
        name: 'Rescue Required',
        type: 'boolean',
        required: true
      },
      {
        id: 'atmosphere_tested',
        name: 'Atmosphere Tested Before Entry',
        type: 'boolean',
        required: true
      },
      {
        id: 'permit_valid',
        name: 'Valid Entry Permit in Place',
        type: 'boolean',
        required: true
      },
      {
        id: 'emergency_type',
        name: 'Type of Emergency',
        type: 'select',
        required: true,
        options: ['Oxygen Deficiency', 'Toxic Gas', 'Engulfment', 'Entrapment', 'Medical Emergency', 'Other']
      }
    ]
  },
  {
    id: 'mining_electrical_shock',
    name: 'Electrical Shock Incident',
    description: 'Personnel contact with electrical source',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['voltage_level', 'injury_severity', 'equipment_involved'],
    customFields: [
      {
        id: 'voltage_level',
        name: 'Voltage Level',
        type: 'select',
        required: true,
        options: ['Low Voltage (<1kV)', 'Medium Voltage (1-35kV)', 'High Voltage (>35kV)', 'Unknown']
      },
      {
        id: 'injury_severity',
        name: 'Injury Severity',
        type: 'select',
        required: true,
        options: ['No Injury', 'Minor Burn', 'Serious Burn', 'Cardiac Event', 'Fatality']
      },
      {
        id: 'equipment_involved',
        name: 'Equipment/System Involved',
        type: 'text',
        required: true
      },
      {
        id: 'lockout_procedure',
        name: 'Lockout/Tagout Procedure Followed',
        type: 'boolean',
        required: true
      },
      {
        id: 'qualified_electrician',
        name: 'Work Performed by Qualified Electrician',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_near_miss_falling',
    name: 'Near Miss - Falling Object',
    description: 'Object fell but did not result in injury or damage',
    type: 'mining',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['object_description', 'potential_outcome'],
    customFields: [
      {
        id: 'object_description',
        name: 'Object That Fell',
        type: 'text',
        required: true,
        placeholder: 'Description and approximate weight'
      },
      {
        id: 'potential_outcome',
        name: 'Potential Outcome if Contact Occurred',
        type: 'select',
        required: true,
        options: ['Minor Injury', 'Serious Injury', 'Fatality', 'Equipment Damage']
      },
      {
        id: 'height_fallen',
        name: 'Approximate Height Fallen (meters)',
        type: 'number',
        required: false
      },
      {
        id: 'root_cause',
        name: 'Suspected Root Cause',
        type: 'select',
        required: true,
        options: ['Poor Housekeeping', 'Equipment Failure', 'Inadequate Securing', 'Ground Movement', 'Human Error', 'Other']
      }
    ]
  },
  {
    id: 'mining_environmental_violation',
    name: 'Environmental Violation/Spill',
    description: 'Environmental impact or regulatory violation',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['violation_type', 'regulatory_requirement'],
    customFields: [
      {
        id: 'violation_type',
        name: 'Type of Environmental Impact',
        type: 'select',
        required: true,
        options: ['Water Discharge', 'Air Emission', 'Soil Contamination', 'Waste Management', 'Noise', 'Dust', 'Other']
      },
      {
        id: 'regulatory_requirement',
        name: 'Regulatory Requirement Violated',
        type: 'text',
        required: true,
        placeholder: 'Permit number or regulation reference'
      },
      {
        id: 'substances_involved',
        name: 'Substances/Materials Involved',
        type: 'textarea',
        required: true
      },
      {
        id: 'authority_notified',
        name: 'Environmental Authority Notified',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_equipment_malfunction',
    name: 'Equipment Malfunction',
    description: 'Critical equipment failure affecting operations',
    type: 'mining',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['equipment_id', 'malfunction_type'],
    customFields: [
      {
        id: 'equipment_id',
        name: 'Equipment ID/Description',
        type: 'text',
        required: true
      },
      {
        id: 'malfunction_type',
        name: 'Type of Malfunction',
        type: 'select',
        required: true,
        options: ['Hydraulic Failure', 'Electrical Failure', 'Mechanical Failure', 'Brake Failure', 'Structural Failure', 'Other']
      },
      {
        id: 'operational_impact',
        name: 'Operational Impact',
        type: 'select',
        required: true,
        options: ['No Impact', 'Minor Delay', 'Significant Delay', 'Full Shutdown']
      },
      {
        id: 'maintenance_current',
        name: 'Maintenance Current/Up to Date',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_ground_fall',
    name: 'Ground Fall/Rockfall',
    description: 'Unplanned ground or rock fall',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['volume_estimate', 'area_secured'],
    customFields: [
      {
        id: 'volume_estimate',
        name: 'Estimated Volume (cubic meters)',
        type: 'number',
        required: true
      },
      {
        id: 'area_secured',
        name: 'Area Secured/Barricaded',
        type: 'boolean',
        required: true
      },
      {
        id: 'ground_support_present',
        name: 'Ground Support Present',
        type: 'boolean',
        required: true
      },
      {
        id: 'geotechnical_reviewed',
        name: 'Geotechnical Review Required',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_explosion_blast',
    name: 'Unplanned Explosion/Blast',
    description: 'Unexpected explosion or blast event',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['explosion_cause', 'injuries_count'],
    customFields: [
      {
        id: 'explosion_cause',
        name: 'Suspected Cause',
        type: 'select',
        required: true,
        options: ['Methane', 'Dust', 'Explosives Misfire', 'Pressure Vessel', 'Chemical Reaction', 'Unknown']
      },
      {
        id: 'injuries_count',
        name: 'Number of Injuries',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'structural_damage',
        name: 'Structural Damage Occurred',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_ventilation_failure',
    name: 'Ventilation System Failure',
    description: 'Failure of underground ventilation system',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['affected_areas', 'personnel_evacuated'],
    customFields: [
      {
        id: 'affected_areas',
        name: 'Affected Underground Areas',
        type: 'textarea',
        required: true
      },
      {
        id: 'personnel_evacuated',
        name: 'Personnel Evacuated',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'gas_detection',
        name: 'Gas Detection Alarms Activated',
        type: 'boolean',
        required: true
      }
    ]
  },
  // Additional 10 mining categories with similar detail...
  {
    id: 'mining_conveyor_accident',
    name: 'Conveyor Belt Accident',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['conveyor_id', 'incident_type'],
    customFields: [
      {
        id: 'conveyor_id',
        name: 'Conveyor System ID',
        type: 'text',
        required: true
      },
      {
        id: 'incident_type',
        name: 'Incident Type',
        type: 'select',
        required: true,
        options: ['Caught in Moving Parts', 'Fall from Height', 'Material Spillage', 'Belt Breakage', 'Other']
      }
    ]
  },
  {
    id: 'mining_crush_injury',
    name: 'Crush/Pinch Injury',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['body_part', 'crushing_object'],
    customFields: [
      {
        id: 'body_part',
        name: 'Body Part Crushed',
        type: 'select',
        required: true,
        options: ['Hand/Fingers', 'Foot/Toes', 'Arm', 'Leg', 'Torso', 'Head', 'Multiple']
      },
      {
        id: 'crushing_object',
        name: 'Object Causing Crush',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 'mining_drowning',
    name: 'Drowning/Water Inrush',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['water_source', 'rescue_status'],
    customFields: [
      {
        id: 'water_source',
        name: 'Water Source',
        type: 'select',
        required: true,
        options: ['Underground Water', 'Surface Water', 'Pipe Burst', 'Dam Failure', 'Unknown']
      },
      {
        id: 'rescue_status',
        name: 'Rescue Status',
        type: 'select',
        required: true,
        options: ['Rescued - Alive', 'Rescued - Deceased', 'Missing', 'Recovered']
      }
    ]
  },
  {
    id: 'mining_radiation',
    name: 'Radiation Exposure',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['radiation_source', 'exposure_level'],
    customFields: [
      {
        id: 'radiation_source',
        name: 'Radiation Source',
        type: 'text',
        required: true
      },
      {
        id: 'exposure_level',
        name: 'Estimated Exposure Level',
        type: 'text',
        required: true,
        placeholder: 'mSv or other unit'
      },
      {
        id: 'personnel_count',
        name: 'Number of Personnel Exposed',
        type: 'number',
        required: true,
        validation: { min: 1 }
      }
    ]
  },
  {
    id: 'mining_heat_stress',
    name: 'Heat Stress/Exhaustion',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['affected_count', 'medical_response'],
    customFields: [
      {
        id: 'affected_count',
        name: 'Number of Affected Personnel',
        type: 'number',
        required: true,
        validation: { min: 1 }
      },
      {
        id: 'medical_response',
        name: 'Medical Response',
        type: 'select',
        required: true,
        options: ['First Aid', 'Paramedics Called', 'Hospital Transport', 'None Required']
      },
      {
        id: 'ambient_temp',
        name: 'Ambient Temperature (°C)',
        type: 'number',
        required: false
      }
    ]
  },
  {
    id: 'mining_noise_exposure',
    name: 'Excessive Noise Exposure',
    type: 'mining',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['noise_level', 'exposure_duration'],
    customFields: [
      {
        id: 'noise_level',
        name: 'Measured Noise Level (dBA)',
        type: 'number',
        required: true
      },
      {
        id: 'exposure_duration',
        name: 'Exposure Duration (hours)',
        type: 'number',
        required: true
      },
      {
        id: 'ppe_used',
        name: 'Hearing Protection Used',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_ergonomic',
    name: 'Ergonomic Injury/Strain',
    type: 'mining',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['injury_location', 'task_performed'],
    customFields: [
      {
        id: 'injury_location',
        name: 'Injury Location on Body',
        type: 'select',
        required: true,
        options: ['Back', 'Shoulder', 'Neck', 'Wrist/Hand', 'Knee', 'Other']
      },
      {
        id: 'task_performed',
        name: 'Task Being Performed',
        type: 'text',
        required: true
      },
      {
        id: 'repetitive_motion',
        name: 'Repetitive Motion Involved',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_inhalation',
    name: 'Toxic Inhalation',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['substance_inhaled', 'personnel_affected'],
    customFields: [
      {
        id: 'substance_inhaled',
        name: 'Substance Inhaled',
        type: 'text',
        required: true
      },
      {
        id: 'personnel_affected',
        name: 'Number of Personnel Affected',
        type: 'number',
        required: true,
        validation: { min: 1 }
      },
      {
        id: 'respiratory_protection',
        name: 'Respiratory Protection Worn',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'mining_vehicle_fire',
    name: 'Surface Vehicle Fire',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['vehicle_type', 'fire_cause'],
    customFields: [
      {
        id: 'vehicle_type',
        name: 'Vehicle Type',
        type: 'text',
        required: true
      },
      {
        id: 'fire_cause',
        name: 'Suspected Fire Cause',
        type: 'select',
        required: true,
        options: ['Electrical', 'Fuel Leak', 'Hydraulic Leak', 'Brake Overheating', 'Engine', 'Unknown']
      }
    ]
  },
  {
    id: 'mining_structural_collapse',
    name: 'Structural Collapse',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['structure_type', 'casualties'],
    customFields: [
      {
        id: 'structure_type',
        name: 'Type of Structure',
        type: 'select',
        required: true,
        options: ['Building', 'Bridge', 'Conveyor Support', 'Retaining Wall', 'Scaffold', 'Other']
      },
      {
        id: 'casualties',
        name: 'Casualties/Injuries',
        type: 'number',
        required: true,
        validation: { min: 0 }
      }
    ]
  },
  {
    id: 'mining_mobile_equipment',
    name: 'Mobile Equipment Incident',
    type: 'mining',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['equipment_type', 'incident_nature'],
    customFields: [
      {
        id: 'equipment_type',
        name: 'Equipment Type',
        type: 'text',
        required: true
      },
      {
        id: 'incident_nature',
        name: 'Nature of Incident',
        type: 'select',
        required: true,
        options: ['Rollover', 'Runaway', 'Struck By/Against', 'Tipping', 'Brake Failure', 'Other']
      }
    ]
  }
];

// Total Mining: 22 categories
export const MINING_CATEGORY_COUNT = MINING_CATEGORIES.length;

// ============================================
// HEALTHCARE INDUSTRY (20 Categories)
// ============================================

const HEALTHCARE_CATEGORIES: IncidentCategory[] = [
  {
    id: 'healthcare_medication_error',
    name: 'Medication Administration Error',
    description: 'Errors in prescribing, dispensing, or administering medications',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['medication_name', 'error_type', 'patient_harm'],
    customFields: [
      {
        id: 'medication_name',
        name: 'Medication Name (Generic)',
        type: 'text',
        required: true,
        placeholder: 'Generic name of medication'
      },
      {
        id: 'error_type',
        name: 'Type of Error',
        type: 'select',
        required: true,
        options: ['Wrong Patient', 'Wrong Medication', 'Wrong Dose', 'Wrong Route', 'Wrong Time', 'Omitted Dose', 'Duplicate Dose']
      },
      {
        id: 'patient_harm',
        name: 'NCC MERP Harm Index',
        type: 'select',
        required: true,
        options: ['Category A - No Error', 'Category B - Error, No Harm', 'Category C - Error, No Harm', 'Category D - Error, Monitoring Required', 'Category E - Temporary Harm', 'Category F - Initial/Prolonged Hospitalization', 'Category G - Permanent Harm', 'Category H - Near Death', 'Category I - Death']
      },
      {
        id: 'prescribed_dose',
        name: 'Prescribed Dose',
        type: 'text',
        required: true
      },
      {
        id: 'administered_dose',
        name: 'Administered Dose',
        type: 'text',
        required: true
      },
      {
        id: 'hipaa_reviewed',
        name: 'HIPAA Compliance Reviewed',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_patient_fall',
    name: 'Patient Fall',
    description: 'Unplanned descent to the floor by a patient',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['injury_sustained', 'fall_location', 'morse_score'],
    customFields: [
      {
        id: 'injury_sustained',
        name: 'Injury Sustained',
        type: 'select',
        required: true,
        options: ['No Injury', 'Minor Injury', 'Moderate Injury (Fracture/Laceration)', 'Severe Injury', 'Death']
      },
      {
        id: 'fall_location',
        name: 'Location of Fall',
        type: 'select',
        required: true,
        options: ['Patient Room', 'Bathroom', 'Hallway', 'Therapy Area', 'Cafeteria', 'Other']
      },
      {
        id: 'morse_score',
        name: 'Morse Fall Risk Score',
        type: 'number',
        required: true,
        validation: { min: 0, max: 125 },
        helpText: 'Score 0-125 (0-24=Low, 25-50=Moderate, 51+=High)'
      },
      {
        id: 'witnessed',
        name: 'Fall Witnessed by Staff',
        type: 'boolean',
        required: true
      },
      {
        id: 'bed_alarm',
        name: 'Bed Alarm in Use',
        type: 'boolean',
        required: true
      },
      {
        id: 'call_light_accessible',
        name: 'Call Light Within Reach',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_wrong_site_surgery',
    name: 'Wrong Site/Wrong Procedure Surgery',
    description: 'Surgery performed on wrong site, side, or wrong procedure',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['error_type', 'timeout_performed', 'site_marking'],
    customFields: [
      {
        id: 'error_type',
        name: 'Type of Error',
        type: 'select',
        required: true,
        options: ['Wrong Site', 'Wrong Side', 'Wrong Procedure', 'Wrong Patient']
      },
      {
        id: 'timeout_performed',
        name: 'Time-Out Performed',
        type: 'boolean',
        required: true
      },
      {
        id: 'site_marking',
        name: 'Surgical Site Marked',
        type: 'boolean',
        required: true
      },
      {
        id: 'consent_verified',
        name: 'Consent Verified',
        type: 'boolean',
        required: true
      },
      {
        id: 'joint_commission_notified',
        name: 'Joint Commission Sentinel Event Report Filed',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_infection',
    name: 'Healthcare-Associated Infection (HAI)',
    description: 'Infection acquired during healthcare delivery',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['infection_type', 'suspected_source'],
    customFields: [
      {
        id: 'infection_type',
        name: 'Type of Infection',
        type: 'select',
        required: true,
        options: ['CLABSI (Central Line)', 'CAUTI (Catheter UTI)', 'SSI (Surgical Site)', 'VAP (Ventilator Pneumonia)', 'C. diff', 'MRSA', 'Other']
      },
      {
        id: 'suspected_source',
        name: 'Suspected Source',
        type: 'select',
        required: true,
        options: ['Central Line', 'Urinary Catheter', 'Surgical Procedure', 'Ventilator', 'Unknown', 'Other']
      },
      {
        id: 'culture_obtained',
        name: 'Culture Obtained',
        type: 'boolean',
        required: true
      },
      {
        id: 'isolation_precautions',
        name: 'Isolation Precautions Implemented',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_device_malfunction',
    name: 'Medical Device Malfunction',
    description: 'Medical equipment failure or malfunction',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['device_type', 'manufacturer', 'patient_impact'],
    customFields: [
      {
        id: 'device_type',
        name: 'Device Type',
        type: 'text',
        required: true,
        placeholder: 'e.g., Infusion Pump, Ventilator, Defibrillator'
      },
      {
        id: 'manufacturer',
        name: 'Manufacturer',
        type: 'text',
        required: true
      },
      {
        id: 'model_number',
        name: 'Model Number',
        type: 'text',
        required: true
      },
      {
        id: 'serial_number',
        name: 'Serial Number',
        type: 'text',
        required: true
      },
      {
        id: 'patient_impact',
        name: 'Patient Impact',
        type: 'select',
        required: true,
        options: ['No Impact', 'Delayed Treatment', 'Minor Injury', 'Serious Injury', 'Death']
      },
      {
        id: 'fda_medwatch',
        name: 'FDA MedWatch Report Required',
        type: 'boolean',
        required: true
      },
      {
        id: 'device_removed',
        name: 'Device Removed from Service',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_patient_identification',
    name: 'Patient Identification Error',
    description: 'Wrong patient identified for treatment/procedure',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['error_stage', 'verification_method'],
    customFields: [
      {
        id: 'error_stage',
        name: 'Stage Error Occurred',
        type: 'select',
        required: true,
        options: ['Registration', 'Medication Administration', 'Lab Draw', 'Transfusion', 'Procedure', 'Other']
      },
      {
        id: 'verification_method',
        name: 'Verification Method Used',
        type: 'select',
        required: true,
        options: ['Wristband', 'Verbal', 'Chart', 'None', 'Multiple Methods']
      },
      {
        id: 'two_identifiers_used',
        name: 'Two Patient Identifiers Used',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_pressure_injury',
    name: 'Pressure Injury Development',
    description: 'Hospital-acquired pressure ulcer/injury',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['stage', 'location', 'braden_score'],
    customFields: [
      {
        id: 'stage',
        name: 'Pressure Injury Stage',
        type: 'select',
        required: true,
        options: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Unstageable', 'Deep Tissue Injury']
      },
      {
        id: 'location',
        name: 'Anatomical Location',
        type: 'select',
        required: true,
        options: ['Sacrum', 'Coccyx', 'Heel', 'Buttocks', 'Hip', 'Elbow', 'Other']
      },
      {
        id: 'braden_score',
        name: 'Braden Scale Score',
        type: 'number',
        required: true,
        validation: { min: 6, max: 23 },
        helpText: '6-9=Severe Risk, 10-12=High Risk, 13-14=Moderate Risk, 15-18=Mild Risk, 19-23=No Risk'
      },
      {
        id: 'prevention_measures',
        name: 'Prevention Measures in Place',
        type: 'multiselect',
        required: true,
        options: ['Repositioning Schedule', 'Pressure-Relieving Mattress', 'Heel Protectors', 'Skin Assessment', 'Nutrition Consultation']
      }
    ]
  },
  {
    id: 'healthcare_elopement',
    name: 'Patient Elopement',
    description: 'Patient left facility without authorization',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['patient_status', 'time_discovered', 'law_enforcement'],
    customFields: [
      {
        id: 'patient_status',
        name: 'Patient Mental Status',
        type: 'select',
        required: true,
        options: ['Alert & Oriented', 'Confused', 'Dementia', 'Psychiatric Hold', 'Other']
      },
      {
        id: 'time_discovered',
        name: 'Time Elopement Discovered',
        type: 'text',
        required: true,
        placeholder: 'HH:MM'
      },
      {
        id: 'last_seen',
        name: 'Last Seen Location',
        type: 'text',
        required: true
      },
      {
        id: 'law_enforcement',
        name: 'Law Enforcement Notified',
        type: 'boolean',
        required: true
      },
      {
        id: 'patient_found',
        name: 'Patient Located',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_lab_error',
    name: 'Laboratory Error',
    description: 'Error in lab specimen or result',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['error_phase', 'test_type'],
    customFields: [
      {
        id: 'error_phase',
        name: 'Phase of Error',
        type: 'select',
        required: true,
        options: ['Pre-analytical (Collection)', 'Analytical (Testing)', 'Post-analytical (Reporting)']
      },
      {
        id: 'test_type',
        name: 'Test Type',
        type: 'text',
        required: true
      },
      {
        id: 'patient_impact',
        name: 'Impact on Patient Care',
        type: 'select',
        required: true,
        options: ['No Impact', 'Delayed Treatment', 'Wrong Treatment', 'Unnecessary Treatment', 'Harm']
      }
    ]
  },
  {
    id: 'healthcare_transfusion_reaction',
    name: 'Blood Transfusion Reaction',
    description: 'Adverse reaction to blood product transfusion',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['reaction_type', 'product_type', 'verification_process'],
    customFields: [
      {
        id: 'reaction_type',
        name: 'Type of Reaction',
        type: 'select',
        required: true,
        options: ['Hemolytic (Acute)', 'Hemolytic (Delayed)', 'Febrile Non-Hemolytic', 'Allergic', 'Anaphylactic', 'TRALI', 'TACO', 'Other']
      },
      {
        id: 'product_type',
        name: 'Blood Product Type',
        type: 'select',
        required: true,
        options: ['Packed RBCs', 'Platelets', 'FFP', 'Cryoprecipitate', 'Whole Blood']
      },
      {
        id: 'verification_process',
        name: 'Two-Person Verification Completed',
        type: 'boolean',
        required: true
      },
      {
        id: 'blood_bank_notified',
        name: 'Blood Bank Notified',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_restraint_injury',
    name: 'Restraint-Related Injury',
    description: 'Injury related to use of physical/chemical restraints',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['restraint_type', 'injury_type', 'order_valid'],
    customFields: [
      {
        id: 'restraint_type',
        name: 'Type of Restraint',
        type: 'select',
        required: true,
        options: ['Physical - Wrist/Ankle', 'Physical - Vest', 'Physical - Belt', 'Chemical/Medication', 'Seclusion']
      },
      {
        id: 'injury_type',
        name: 'Type of Injury',
        type: 'select',
        required: true,
        options: ['Bruising', 'Skin Tear', 'Circulation Issues', 'Respiratory Compromise', 'Psychological', 'Other']
      },
      {
        id: 'order_valid',
        name: 'Valid Physician Order Present',
        type: 'boolean',
        required: true
      },
      {
        id: 'monitoring_frequency',
        name: 'Monitoring Every',
        type: 'select',
        required: true,
        options: ['15 minutes', '30 minutes', '1 hour', '2 hours', 'Not Documented']
      }
    ]
  },
  {
    id: 'healthcare_specimen_lost',
    name: 'Lost/Mislabeled Specimen',
    description: 'Laboratory specimen lost or incorrectly labeled',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['specimen_type', 'error_type'],
    customFields: [
      {
        id: 'specimen_type',
        name: 'Specimen Type',
        type: 'select',
        required: true,
        options: ['Blood', 'Urine', 'Tissue/Biopsy', 'Surgical Specimen', 'Other Body Fluid']
      },
      {
        id: 'error_type',
        name: 'Error Type',
        type: 'select',
        required: true,
        options: ['Lost in Transit', 'Mislabeled', 'Wrong Patient Label', 'Unlabeled', 'Contaminated']
      },
      {
        id: 'recollection_possible',
        name: 'Recollection Possible',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_maternal_fetal',
    name: 'Maternal/Fetal Complication',
    description: 'Unexpected maternal or fetal outcome',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['complication_type', 'outcome'],
    customFields: [
      {
        id: 'complication_type',
        name: 'Complication Type',
        type: 'select',
        required: true,
        options: ['Maternal Hemorrhage', 'Fetal Distress', 'Uterine Rupture', 'Shoulder Dystocia', 'Cord Prolapse', 'Other']
      },
      {
        id: 'outcome',
        name: 'Outcome',
        type: 'select',
        required: true,
        options: ['Mother and Baby Stable', 'Maternal Complication', 'Fetal Complication', 'Both Affected', 'Fetal Death', 'Maternal Death']
      },
      {
        id: 'emergency_cs',
        name: 'Emergency C-Section Required',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_delayed_diagnosis',
    name: 'Delayed/Missed Diagnosis',
    description: 'Failure to diagnose condition in timely manner',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['condition_missed', 'delay_duration'],
    customFields: [
      {
        id: 'condition_missed',
        name: 'Condition Missed/Delayed',
        type: 'text',
        required: true
      },
      {
        id: 'delay_duration',
        name: 'Delay Duration',
        type: 'select',
        required: true,
        options: ['< 24 hours', '1-3 days', '4-7 days', '1-4 weeks', '> 1 month']
      },
      {
        id: 'diagnostic_tests_available',
        name: 'Diagnostic Tests Were Available',
        type: 'boolean',
        required: true
      },
      {
        id: 'patient_outcome',
        name: 'Impact on Patient Outcome',
        type: 'select',
        required: true,
        options: ['No Impact', 'Delayed Treatment', 'Worse Outcome', 'Permanent Harm', 'Death']
      }
    ]
  },
  {
    id: 'healthcare_consent_violation',
    name: 'Informed Consent Violation',
    description: 'Procedure performed without proper informed consent',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['procedure_type', 'consent_issue'],
    customFields: [
      {
        id: 'procedure_type',
        name: 'Procedure/Treatment Type',
        type: 'text',
        required: true
      },
      {
        id: 'consent_issue',
        name: 'Consent Issue',
        type: 'select',
        required: true,
        options: ['No Consent Obtained', 'Expired Consent', 'Incomplete Consent', 'Patient Lacked Capacity', 'Wrong Procedure on Consent']
      }
    ]
  },
  {
    id: 'healthcare_burn_injury',
    name: 'Patient Burn Injury',
    description: 'Burn injury sustained during care',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['burn_source', 'burn_degree', 'body_surface_area'],
    customFields: [
      {
        id: 'burn_source',
        name: 'Burn Source',
        type: 'select',
        required: true,
        options: ['Hot Liquid', 'Heating Pad', 'Cautery Device', 'Chemical', 'Radiation', 'Other']
      },
      {
        id: 'burn_degree',
        name: 'Burn Degree',
        type: 'select',
        required: true,
        options: ['First Degree', 'Second Degree', 'Third Degree']
      },
      {
        id: 'body_surface_area',
        name: 'Approximate Body Surface Area %',
        type: 'number',
        required: true,
        validation: { min: 0, max: 100 }
      }
    ]
  },
  {
    id: 'healthcare_workplace_violence',
    name: 'Workplace Violence - Healthcare',
    description: 'Violence against healthcare workers',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['violence_type', 'perpetrator', 'injuries'],
    customFields: [
      {
        id: 'violence_type',
        name: 'Type of Violence',
        type: 'select',
        required: true,
        options: ['Verbal Abuse', 'Physical Assault', 'Sexual Assault', 'Threat with Weapon', 'Intimidation']
      },
      {
        id: 'perpetrator',
        name: 'Perpetrator',
        type: 'select',
        required: true,
        options: ['Patient', 'Family Member', 'Visitor', 'Staff Member', 'Unknown']
      },
      {
        id: 'injuries',
        name: 'Injuries to Staff',
        type: 'select',
        required: true,
        options: ['None', 'Minor', 'Moderate', 'Severe']
      },
      {
        id: 'security_called',
        name: 'Security Called',
        type: 'boolean',
        required: true
      },
      {
        id: 'police_called',
        name: 'Police Called',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_equipment_contamination',
    name: 'Equipment Contamination/Sterilization Failure',
    description: 'Failure in equipment sterilization process',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['equipment_type', 'sterilization_method', 'patients_affected'],
    customFields: [
      {
        id: 'equipment_type',
        name: 'Equipment Type',
        type: 'text',
        required: true
      },
      {
        id: 'sterilization_method',
        name: 'Sterilization Method',
        type: 'select',
        required: true,
        options: ['Steam Autoclave', 'Ethylene Oxide', 'Hydrogen Peroxide', 'Chemical', 'Other']
      },
      {
        id: 'patients_affected',
        name: 'Number of Patients Potentially Affected',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'recall_issued',
        name: 'Equipment Recall Issued',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_neonatal',
    name: 'Neonatal Complication',
    description: 'Unexpected neonatal adverse event',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['complication_type', 'gestational_age'],
    customFields: [
      {
        id: 'complication_type',
        name: 'Complication Type',
        type: 'select',
        required: true,
        options: ['Respiratory Distress', 'Hypoglycemia', 'Jaundice', 'Infection', 'Birth Trauma', 'Other']
      },
      {
        id: 'gestational_age',
        name: 'Gestational Age (weeks)',
        type: 'number',
        required: true,
        validation: { min: 20, max: 45 }
      },
      {
        id: 'nicu_admission',
        name: 'NICU Admission Required',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'healthcare_anesthesia_complication',
    name: 'Anesthesia Complication',
    description: 'Adverse event related to anesthesia',
    type: 'healthcare',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['anesthesia_type', 'complication'],
    customFields: [
      {
        id: 'anesthesia_type',
        name: 'Type of Anesthesia',
        type: 'select',
        required: true,
        options: ['General', 'Spinal', 'Epidural', 'Local', 'MAC (Monitored Anesthesia Care)']
      },
      {
        id: 'complication',
        name: 'Complication',
        type: 'select',
        required: true,
        options: ['Awareness Under Anesthesia', 'Aspiration', 'Malignant Hyperthermia', 'Allergic Reaction', 'Respiratory Compromise', 'Cardiac Event', 'Other']
      },
      {
        id: 'asa_score',
        name: 'ASA Physical Status Score',
        type: 'select',
        required: true,
        options: ['ASA 1', 'ASA 2', 'ASA 3', 'ASA 4', 'ASA 5', 'ASA 6']
      }
    ]
  }
];

// Total Healthcare: 20 categories
export const HEALTHCARE_CATEGORY_COUNT = HEALTHCARE_CATEGORIES.length;

// ============================================
// RETAIL INDUSTRY (20 Categories)
// ============================================

const RETAIL_CATEGORIES: IncidentCategory[] = [
  {
    id: 'retail_customer_fall',
    name: 'Customer Slip/Trip/Fall',
    description: 'Customer fall resulting in injury or near-miss',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['injury_sustained', 'floor_condition', 'medical_attention'],
    customFields: [
      {
        id: 'injury_sustained',
        name: 'Injury Sustained',
        type: 'select',
        required: true,
        options: ['No Injury', 'Minor Injury', 'Moderate Injury', 'Serious Injury (Fracture/Head)', 'Transported to Hospital']
      },
      {
        id: 'floor_condition',
        name: 'Floor Condition',
        type: 'select',
        required: true,
        options: ['Dry', 'Wet/Spill', 'Icy', 'Debris Present', 'Uneven Surface', 'Mat/Rug', 'Other']
      },
      {
        id: 'medical_attention',
        name: 'Medical Attention Provided',
        type: 'select',
        required: true,
        options: ['First Aid', 'EMS Called', 'Customer Refused', 'None Needed']
      },
      {
        id: 'wet_floor_sign',
        name: 'Wet Floor Sign Present',
        type: 'boolean',
        required: true
      },
      {
        id: 'incident_report_customer',
        name: 'Incident Report Completed',
        type: 'boolean',
        required: true
      },
      {
        id: 'witness_present',
        name: 'Witnesses Present',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_shoplifting',
    name: 'Shoplifting/Theft Incident',
    description: 'Suspected or confirmed theft of merchandise',
    type: 'retail',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['incident_type', 'merchandise_value', 'police_notified'],
    customFields: [
      {
        id: 'incident_type',
        name: 'Incident Type',
        type: 'select',
        required: true,
        options: ['Suspected Shoplifting', 'Apprehension Made', 'Found Merchandise', 'EAS Alarm', 'Internal Theft']
      },
      {
        id: 'merchandise_value',
        name: 'Estimated Merchandise Value ($)',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'police_notified',
        name: 'Police Notified',
        type: 'boolean',
        required: true
      },
      {
        id: 'suspect_description',
        name: 'Suspect Description',
        type: 'textarea',
        required: false
      },
      {
        id: 'video_footage',
        name: 'Video Footage Available',
        type: 'boolean',
        required: true
      },
      {
        id: 'merchandise_recovered',
        name: 'Merchandise Recovered',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_cash_discrepancy',
    name: 'Cash Register Discrepancy',
    description: 'Cash shortage or overage at register',
    type: 'retail',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['discrepancy_amount', 'register_number', 'cashier_id'],
    customFields: [
      {
        id: 'discrepancy_amount',
        name: 'Discrepancy Amount ($)',
        type: 'number',
        required: true
      },
      {
        id: 'discrepancy_type',
        name: 'Type',
        type: 'select',
        required: true,
        options: ['Shortage', 'Overage']
      },
      {
        id: 'register_number',
        name: 'Register Number',
        type: 'text',
        required: true
      },
      {
        id: 'cashier_id',
        name: 'Cashier ID/Name',
        type: 'text',
        required: true
      },
      {
        id: 'manager_verified',
        name: 'Manager Verified Count',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_equipment_malfunction',
    name: 'Equipment Malfunction',
    description: 'Store equipment failure or malfunction',
    type: 'retail',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['equipment_type', 'operational_impact'],
    customFields: [
      {
        id: 'equipment_type',
        name: 'Equipment Type',
        type: 'select',
        required: true,
        options: ['POS/Register', 'Refrigeration', 'HVAC', 'Elevator/Escalator', 'Doors', 'Lighting', 'Security System', 'Other']
      },
      {
        id: 'operational_impact',
        name: 'Operational Impact',
        type: 'select',
        required: true,
        options: ['No Impact', 'Partial Impact', 'Significant Impact', 'Store Closure Required']
      },
      {
        id: 'maintenance_called',
        name: 'Maintenance/Service Called',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_food_safety',
    name: 'Food Safety Incident',
    description: 'Food safety concern or contamination',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['incident_type', 'product_details', 'customer_illness'],
    customFields: [
      {
        id: 'incident_type',
        name: 'Incident Type',
        type: 'select',
        required: true,
        options: ['Temperature Violation', 'Cross-Contamination', 'Foreign Object', 'Expired Product', 'Customer Complaint of Illness', 'Pest Infestation']
      },
      {
        id: 'product_details',
        name: 'Product Details',
        type: 'textarea',
        required: true,
        placeholder: 'Product name, lot number, expiration date'
      },
      {
        id: 'customer_illness',
        name: 'Customer Reported Illness',
        type: 'boolean',
        required: true
      },
      {
        id: 'product_removed',
        name: 'Product Removed from Sale',
        type: 'boolean',
        required: true
      },
      {
        id: 'health_dept_notified',
        name: 'Health Department Notified',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_workplace_violence',
    name: 'Workplace Violence',
    description: 'Violence or threat against employees',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['violence_type', 'perpetrator_type', 'injuries'],
    customFields: [
      {
        id: 'violence_type',
        name: 'Type of Violence',
        type: 'select',
        required: true,
        options: ['Verbal Threat', 'Physical Assault', 'Robbery', 'Domestic Violence', 'Active Shooter', 'Other']
      },
      {
        id: 'perpetrator_type',
        name: 'Perpetrator',
        type: 'select',
        required: true,
        options: ['Customer', 'Former Employee', 'Acquaintance', 'Unknown/Stranger']
      },
      {
        id: 'injuries',
        name: 'Injuries to Staff',
        type: 'select',
        required: true,
        options: ['None', 'Minor', 'Moderate', 'Severe', 'Fatal']
      },
      {
        id: 'police_called',
        name: 'Police Called',
        type: 'boolean',
        required: true
      },
      {
        id: 'store_closed',
        name: 'Store Closed Due to Incident',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_fire_evacuation',
    name: 'Fire/Evacuation',
    description: 'Fire or emergency evacuation of store',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['incident_type', 'evacuation_completed', 'fire_dept_called'],
    customFields: [
      {
        id: 'incident_type',
        name: 'Incident Type',
        type: 'select',
        required: true,
        options: ['Actual Fire', 'Smoke/Odor', 'Fire Alarm Activation', 'Gas Leak', 'Bomb Threat', 'Other Emergency']
      },
      {
        id: 'evacuation_completed',
        name: 'Evacuation Completed',
        type: 'boolean',
        required: true
      },
      {
        id: 'fire_dept_called',
        name: 'Fire Department Called',
        type: 'boolean',
        required: true
      },
      {
        id: 'injuries_count',
        name: 'Number of Injuries',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'property_damage',
        name: 'Property Damage Occurred',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_product_recall',
    name: 'Product Recall',
    description: 'Product recall notification and response',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['product_details', 'recall_class', 'units_affected'],
    customFields: [
      {
        id: 'product_details',
        name: 'Product Details',
        type: 'textarea',
        required: true,
        placeholder: 'Product name, UPC, lot numbers'
      },
      {
        id: 'recall_class',
        name: 'Recall Class',
        type: 'select',
        required: true,
        options: ['Class I (Serious/Death)', 'Class II (Temporary Harm)', 'Class III (Unlikely to Cause Harm)']
      },
      {
        id: 'units_affected',
        name: 'Units in Inventory',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'product_removed',
        name: 'Product Removed from Shelves',
        type: 'boolean',
        required: true
      },
      {
        id: 'customers_notified',
        name: 'Customers Notified (if sold)',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_parking_lot',
    name: 'Parking Lot Incident',
    description: 'Incident occurring in parking lot',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['incident_type', 'injuries'],
    customFields: [
      {
        id: 'incident_type',
        name: 'Incident Type',
        type: 'select',
        required: true,
        options: ['Vehicle Accident', 'Pedestrian Struck', 'Slip/Fall', 'Assault', 'Vehicle Theft', 'Property Damage', 'Other']
      },
      {
        id: 'injuries',
        name: 'Injuries',
        type: 'select',
        required: true,
        options: ['None', 'Minor', 'Moderate', 'Severe']
      },
      {
        id: 'police_called',
        name: 'Police Called',
        type: 'boolean',
        required: true
      },
      {
        id: 'video_footage',
        name: 'Video Footage Available',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_employee_injury',
    name: 'Employee Injury',
    description: 'Employee workplace injury',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['injury_type', 'body_part', 'medical_treatment'],
    customFields: [
      {
        id: 'injury_type',
        name: 'Type of Injury',
        type: 'select',
        required: true,
        options: ['Cut/Laceration', 'Slip/Fall', 'Lifting/Strain', 'Struck By Object', 'Burn', 'Repetitive Motion', 'Other']
      },
      {
        id: 'body_part',
        name: 'Body Part Affected',
        type: 'select',
        required: true,
        options: ['Head', 'Eyes', 'Back', 'Arms/Hands', 'Legs/Feet', 'Multiple', 'Other']
      },
      {
        id: 'medical_treatment',
        name: 'Medical Treatment',
        type: 'select',
        required: true,
        options: ['First Aid Only', 'Clinic Visit', 'ER Visit', 'Hospitalization', 'None']
      },
      {
        id: 'lost_time',
        name: 'Lost Time Expected',
        type: 'boolean',
        required: true
      },
      {
        id: 'osha_recordable',
        name: 'OSHA Recordable',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_customer_complaint',
    name: 'Customer Complaint/Dispute',
    description: 'Significant customer service issue',
    type: 'retail',
    requiresApproval: false,
    defaultSeverity: 'low',
    escalationLevel: 'level_1',
    requiredFields: ['complaint_type', 'resolution'],
    customFields: [
      {
        id: 'complaint_type',
        name: 'Complaint Type',
        type: 'select',
        required: true,
        options: ['Product Quality', 'Pricing Issue', 'Staff Behavior', 'Refund/Return', 'Service Delay', 'Other']
      },
      {
        id: 'resolution',
        name: 'Resolution',
        type: 'select',
        required: true,
        options: ['Refund Issued', 'Exchange Made', 'Apology Given', 'Escalated to Corporate', 'Unresolved']
      },
      {
        id: 'customer_satisfied',
        name: 'Customer Satisfied with Resolution',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_chemical_spill',
    name: 'Chemical Spill/Hazmat',
    description: 'Chemical spill or hazardous material incident',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['chemical_name', 'quantity', 'containment'],
    customFields: [
      {
        id: 'chemical_name',
        name: 'Chemical/Product Name',
        type: 'text',
        required: true
      },
      {
        id: 'quantity',
        name: 'Approximate Quantity',
        type: 'text',
        required: true
      },
      {
        id: 'containment',
        name: 'Spill Contained',
        type: 'boolean',
        required: true
      },
      {
        id: 'area_evacuated',
        name: 'Area Evacuated',
        type: 'boolean',
        required: true
      },
      {
        id: 'hazmat_team',
        name: 'Hazmat Team Called',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_power_outage',
    name: 'Power Outage',
    description: 'Loss of electrical power',
    type: 'retail',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['outage_duration', 'impact', 'generator_status'],
    customFields: [
      {
        id: 'outage_duration',
        name: 'Outage Duration',
        type: 'select',
        required: true,
        options: ['< 15 minutes', '15-60 minutes', '1-4 hours', '4+ hours', 'Unknown']
      },
      {
        id: 'impact',
        name: 'Operational Impact',
        type: 'select',
        required: true,
        options: ['Minimal', 'Moderate', 'Store Closed', 'Merchandise Loss']
      },
      {
        id: 'generator_status',
        name: 'Backup Generator Status',
        type: 'select',
        required: true,
        options: ['Activated Successfully', 'Failed to Activate', 'No Generator', 'Partial Coverage']
      },
      {
        id: 'perishable_loss',
        name: 'Perishable Product Loss',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_data_breach',
    name: 'Data Breach/POS Compromise',
    description: 'Suspected data breach or POS system compromise',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['breach_type', 'customer_data_affected', 'it_notified'],
    customFields: [
      {
        id: 'breach_type',
        name: 'Breach Type',
        type: 'select',
        required: true,
        options: ['POS Malware', 'Skimming Device Found', 'Network Intrusion', 'Lost/Stolen Device', 'Email Phishing', 'Unknown']
      },
      {
        id: 'customer_data_affected',
        name: 'Customer Data Potentially Affected',
        type: 'boolean',
        required: true
      },
      {
        id: 'it_notified',
        name: 'IT/Security Team Notified',
        type: 'boolean',
        required: true
      },
      {
        id: 'law_enforcement',
        name: 'Law Enforcement Notified',
        type: 'boolean',
        required: true
      },
      {
        id: 'estimated_records',
        name: 'Estimated Records Affected',
        type: 'number',
        required: false,
        validation: { min: 0 }
      }
    ]
  },
  {
    id: 'retail_vendor_incident',
    name: 'Vendor/Contractor Incident',
    description: 'Incident involving vendor or contractor',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['vendor_name', 'incident_type', 'injuries'],
    customFields: [
      {
        id: 'vendor_name',
        name: 'Vendor/Contractor Name',
        type: 'text',
        required: true
      },
      {
        id: 'incident_type',
        name: 'Incident Type',
        type: 'select',
        required: true,
        options: ['Injury', 'Property Damage', 'Vehicle Accident', 'Safety Violation', 'Quality Issue', 'Other']
      },
      {
        id: 'injuries',
        name: 'Injuries',
        type: 'select',
        required: true,
        options: ['None', 'Minor', 'Moderate', 'Severe']
      },
      {
        id: 'vendor_insurance',
        name: 'Vendor Insurance Info Obtained',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_product_tampering',
    name: 'Product Tampering',
    description: 'Suspected product tampering or contamination',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'critical',
    escalationLevel: 'level_4',
    requiredFields: ['product_details', 'tampering_type', 'authorities_notified'],
    customFields: [
      {
        id: 'product_details',
        name: 'Product Details',
        type: 'textarea',
        required: true
      },
      {
        id: 'tampering_type',
        name: 'Type of Tampering',
        type: 'select',
        required: true,
        options: ['Package Opened/Resealed', 'Foreign Object', 'Contamination', 'Needle/Sharp Object', 'Chemical', 'Other']
      },
      {
        id: 'authorities_notified',
        name: 'Authorities Notified (Police/FDA)',
        type: 'boolean',
        required: true
      },
      {
        id: 'product_quarantined',
        name: 'All Similar Products Quarantined',
        type: 'boolean',
        required: true
      },
      {
        id: 'media_involvement',
        name: 'Media Involvement',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_suspicious_activity',
    name: 'Suspicious Activity',
    description: 'Suspicious behavior or potential security threat',
    type: 'retail',
    requiresApproval: false,
    defaultSeverity: 'medium',
    escalationLevel: 'level_2',
    requiredFields: ['activity_type', 'police_called'],
    customFields: [
      {
        id: 'activity_type',
        name: 'Activity Type',
        type: 'select',
        required: true,
        options: ['Loitering', 'Photography/Surveillance', 'Trespassing', 'Abandoned Package', 'Verbal Threats', 'Other']
      },
      {
        id: 'police_called',
        name: 'Police Called',
        type: 'boolean',
        required: true
      },
      {
        id: 'video_footage',
        name: 'Video Footage Captured',
        type: 'boolean',
        required: true
      },
      {
        id: 'subject_description',
        name: 'Subject Description',
        type: 'textarea',
        required: false
      }
    ]
  },
  {
    id: 'retail_price_error',
    name: 'Significant Pricing Error',
    description: 'Major pricing or scanning error',
    type: 'retail',
    requiresApproval: false,
    defaultSeverity: 'low',
    escalationLevel: 'level_1',
    requiredFields: ['error_type', 'items_affected', 'financial_impact'],
    customFields: [
      {
        id: 'error_type',
        name: 'Error Type',
        type: 'select',
        required: true,
        options: ['Incorrect Tag Price', 'Scanning Error', 'Promotional Price Error', 'System Glitch', 'Human Error']
      },
      {
        id: 'items_affected',
        name: 'Number of Items Affected',
        type: 'number',
        required: true,
        validation: { min: 1 }
      },
      {
        id: 'financial_impact',
        name: 'Estimated Financial Impact ($)',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        id: 'corrected',
        name: 'Error Corrected',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_emergency_exit',
    name: 'Emergency Exit Blocked/Alarm',
    description: 'Emergency exit blocked or alarm activation',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['incident_type', 'exit_location', 'corrective_action'],
    customFields: [
      {
        id: 'incident_type',
        name: 'Incident Type',
        type: 'select',
        required: true,
        options: ['Exit Blocked', 'Exit Locked', 'Alarm Malfunction', 'Unauthorized Exit Use', 'Exit Light Out']
      },
      {
        id: 'exit_location',
        name: 'Exit Location',
        type: 'text',
        required: true
      },
      {
        id: 'corrective_action',
        name: 'Immediate Corrective Action Taken',
        type: 'textarea',
        required: true
      },
      {
        id: 'fire_marshal_notified',
        name: 'Fire Marshal Notification Required',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    id: 'retail_underage_sale',
    name: 'Underage Sale (Alcohol/Tobacco)',
    description: 'Suspected or confirmed sale to minor',
    type: 'retail',
    requiresApproval: true,
    defaultSeverity: 'high',
    escalationLevel: 'level_3',
    requiredFields: ['product_type', 'id_checked', 'enforcement_action'],
    customFields: [
      {
        id: 'product_type',
        name: 'Product Type',
        type: 'select',
        required: true,
        options: ['Alcohol', 'Tobacco/Nicotine', 'Lottery', 'Restricted Video Game', 'Other Restricted Item']
      },
      {
        id: 'id_checked',
        name: 'ID Checked',
        type: 'boolean',
        required: true
      },
      {
        id: 'enforcement_action',
        name: 'Law Enforcement/Regulatory Action',
        type: 'select',
        required: true,
        options: ['Sting Operation', 'Customer Report', 'Compliance Check', 'Citation Issued', 'Warning Issued', 'No Action']
      },
      {
        id: 'cashier_id',
        name: 'Cashier ID',
        type: 'text',
        required: true
      },
      {
        id: 'video_review',
        name: 'Video Reviewed',
        type: 'boolean',
        required: true
      }
    ]
  }
];

// Total Retail: 20 categories
export const RETAIL_CATEGORY_COUNT = RETAIL_CATEGORIES.length;

// ============================================
// EXPORT ALL CATEGORIES
// ============================================

export const ALL_INCIDENT_CATEGORIES = [
  ...GENERAL_CATEGORIES,
  ...MINING_CATEGORIES,
  ...HEALTHCARE_CATEGORIES,
  ...RETAIL_CATEGORIES
];

// Total count: 2 general + 22 mining + 20 healthcare + 20 retail = 64 categories
export const TOTAL_CATEGORIES = ALL_INCIDENT_CATEGORIES.length;

// Helper functions
export const getCategoriesByIndustry = (industryType: 'mining' | 'healthcare' | 'retail' | 'corporate'): IncidentCategory[] => {
  if (industryType === 'corporate') {
    return GENERAL_CATEGORIES;
  }
  return ALL_INCIDENT_CATEGORIES.filter(cat => cat.type === industryType || cat.type === 'corporate');
};

export const getCategoryById = (id: string): IncidentCategory | undefined => {
  return ALL_INCIDENT_CATEGORIES.find(cat => cat.id === id);
};

export const getRequiredCategories = (): IncidentCategory[] => {
  return ALL_INCIDENT_CATEGORIES.filter(cat => cat.requiresApproval);
};

export const getCategoriesBySeverity = (severity: 'low' | 'medium' | 'high' | 'critical'): IncidentCategory[] => {
  return ALL_INCIDENT_CATEGORIES.filter(cat => cat.defaultSeverity === severity);
};
