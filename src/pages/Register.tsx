import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { Heart, Building2, GraduationCap, Microscope } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const userTypeOptions = [
  { type: 'doctor', label: 'Doctor', icon: Heart },
  { type: 'ngo', label: 'NGO', icon: Building2 },
  { type: 'volunteer', label: 'Volunteer', icon: GraduationCap },
  { type: 'research', label: 'Research Institution', icon: Microscope },
];

const baseSchema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
});

const doctorSchema = baseSchema.extend({
  type: z.literal('doctor'),
  name: z.string().min(1, 'Name is required'),
  uniqueId: z.string().min(1, 'Unique ID is required'),
  education: z.string().min(1, 'Education is required'),
  yearsOfPractice: z.string().min(1, 'Years of practice is required'),
  clinicLocation: z.string().min(1, 'Clinic location is required'),
});

const ngoSchema = baseSchema.extend({
  type: z.literal('ngo'),
  name: z.string().min(1, 'NGO name is required'),
  organization: z.string().min(1, 'Organization is required'),
});

const volunteerSchema = baseSchema.extend({
  type: z.literal('volunteer'),
  name: z.string().min(1, 'Name is required'),
  education: z.string().min(1, 'Education is required'),
});

const researchSchema = baseSchema.extend({
  type: z.literal('research'),
  name: z.string().min(1, 'Institution name is required'),
});

function Register() {
  const [userType, setUserType] = useState(null);

  const getSchemaForUserType = (type) => {
    switch (type) {
      case 'doctor':
        return doctorSchema;
      case 'ngo':
        return ngoSchema;
      case 'volunteer':
        return volunteerSchema;
      case 'research':
        return researchSchema;
      default:
        return baseSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(userType ? getSchemaForUserType(userType) : baseSchema),
  });

  function onSubmit(data) {
    console.log(data);
  }

  const renderForm = () => {
    if (!userType) return null;

    const commonFields = (
      <>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );

    switch (userType) {
      case 'doctor':
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uniqueId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unique ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfPractice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Practice</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {commonFields}
          </>
        );
      case 'ngo':
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NGO Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {commonFields}
          </>
        );
      case 'volunteer':
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {commonFields}
          </>
        );
      case 'research':
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {commonFields}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join our community and make a difference."
    >
      {!userType ? (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Select your role</h3>
          <div className="grid grid-cols-2 gap-4">
            {userTypeOptions.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => {
                  setUserType(type);
                  form.reset();
                }}
                className="p-4 border-2 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                <span className="block text-sm font-medium text-gray-900">{label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setUserType(null);
                  form.reset();
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Change role
              </button>
            </div>

            {renderForm()}

            <div className="space-y-4">
              <Button type="submit" fullWidth>
                Create Account
              </Button>

              <Button type="button" variant="outline" fullWidth>
                Sign up with Google
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
}

export default Register;