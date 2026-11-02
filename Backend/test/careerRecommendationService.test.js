import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildCareerRecommendationsPrompt,
  calculateCareerMatch,
  getFallbackLocalizedContent,
  hasValidLocalizedContent,
  getInterestScore,
} from '../src/services/careerRecommendationService.js';

const technologyCareer = {
  _id: 'technology-career',
  title: 'Frontend Developer',
  sector: 'Technology',
  requiredTechnicalSkills: [{ name: 'JavaScript', importance: 'Core', weight: 2 }],
  requiredSoftSkills: ['Communication'],
  requiredQualifications: [],
  suggestedNextSteps: [],
};

const teacherCareer = {
  _id: 'teacher-career',
  title: 'Teacher',
  sector: 'Education & Training',
  requiredTechnicalSkills: [{ name: 'Lesson Planning', importance: 'Core', weight: 2 }],
  requiredSoftSkills: ['Communication', 'Patience'],
  requiredQualifications: [],
  suggestedNextSteps: [],
};

const accountantCareer = {
  _id: 'accountant-career',
  title: 'Accountant',
  sector: 'Finance & Banking',
  requiredTechnicalSkills: [{ name: 'Accounting', importance: 'Core', weight: 2 }],
  requiredSoftSkills: ['Attention to Detail'],
  requiredQualifications: [],
  suggestedNextSteps: [],
};

test('teacher interests rank education careers above an unrelated technical match', () => {
  const student = {
    degree: 'BCA',
    department: 'Computer Science',
    cgpa: 8,
    technicalSkills: [{ name: 'JavaScript', proficiency: 'Advanced' }],
    softSkills: ['Communication'],
    careerInterests: ['teacher'],
  };
  const teacherMatch = calculateCareerMatch(student, teacherCareer);
  const technologyMatch = calculateCareerMatch(student, technologyCareer);

  assert.equal(teacherMatch.scoreBreakdown.interestAlignmentScore, 100);
  assert.ok(teacherMatch.matchPercentage > technologyMatch.matchPercentage);
});

test('accountant and accounting interests align to finance careers', () => {
  assert.equal(getInterestScore(['accountant'], accountantCareer), 100);
  assert.equal(getInterestScore(['accounting'], accountantCareer), 90);
  assert.equal(getInterestScore(['accountant'], technologyCareer), 35);
});

test('career recommendations keep skill matching useful when there are no interests', () => {
  const student = {
    degree: 'BCA',
    department: 'Computer Science',
    cgpa: 8,
    technicalSkills: [{ name: 'JavaScript', proficiency: 'Advanced' }],
    softSkills: ['Communication'],
    careerInterests: [],
  };

  const match = calculateCareerMatch(student, technologyCareer);

  assert.equal(match.scoreBreakdown.interestAlignmentScore, 35);
  assert.ok(match.matchPercentage > 50);
});

test('career recommendation prompt follows the selected response language', () => {
  const prompt = buildCareerRecommendationsPrompt(
    { degree: 'B.Com', technicalSkills: [], softSkills: [], careerInterests: ['accounting'] },
    [calculateCareerMatch({ careerInterests: ['accounting'] }, accountantCareer)],
    'Assamese'
  );

  assert.match(prompt, /Generate all explanatory content in natural, fluent Assamese \(অসমীয়া\)/);
  assert.match(prompt, /"localizedCareerTitle"/);
  assert.match(prompt, /exact unchanged title/);
});

test('Assamese recommendation fallback localizes descriptions without translating skill names', () => {
  const recommendation = calculateCareerMatch(
    { careerInterests: ['accounting'], technicalSkills: [] },
    accountantCareer
  );
  const localized = getFallbackLocalizedContent(recommendation, 'Assamese');

  assert.equal(localized.localizedCareerTitle, 'একাউণ্টেণ্ট');
  assert.match(localized.localizedCareerDescription, /[\u0980-\u09FF]/u);
  assert.match(localized.localizedCareerFitSummary, /[\u0980-\u09FF]/u);
  assert.ok(localized.localizedSuggestedNextSteps.every((step) => /[\u0980-\u09FF]/u.test(step)));
});

test('recommendation content validation rejects untranslated Assamese fields', () => {
  assert.equal(
    hasValidLocalizedContent(
      {
        localizedCareerTitle: 'Accountant',
        localizedSector: 'Finance',
        localizedCareerDescription: 'This is a career.',
        localizedCareerFitSummary: 'This fits you.',
        localizedRequiredQualifications: ['Degree required'],
        localizedSuggestedNextSteps: ['Learn accounting'],
      },
      'Assamese'
    ),
    false
  );
});
