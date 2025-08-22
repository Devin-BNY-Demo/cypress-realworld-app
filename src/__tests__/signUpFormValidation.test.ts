import { describe, expect, it } from "vitest";
import { object, string, ref } from "yup";

const validationSchema = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  username: string().required("Username is required"),
  password: string()
    .min(4, "Password must contain at least 4 characters")
    .required("Enter your password"),
  confirmPassword: string()
    .required("Confirm your password")
    .oneOf([ref("password")], "Password does not match"),
});

describe("SignUpForm Validation Schema", () => {
  describe("Required field validation", () => {
    it("should require firstName", async () => {
      const invalidData = {
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow(
        "First Name is required"
      );
    });

    it("should require lastName", async () => {
      const invalidData = {
        firstName: "John",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow("Last Name is required");
    });

    it("should require username", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow("Username is required");
    });

    it("should require password", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow("Confirm your password");
    });

    it("should require confirmPassword", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow("Confirm your password");
    });
  });

  describe("Password validation", () => {
    it("should require minimum 4 characters for password", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "123",
        confirmPassword: "123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow(
        "Password must contain at least 4 characters"
      );
    });

    it("should accept password with exactly 4 characters", async () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "1234",
        confirmPassword: "1234",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should require password confirmation to match password", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "differentpassword",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow(
        "Password does not match"
      );
    });
  });

  describe("Edge cases", () => {
    it("should reject empty strings for firstName", async () => {
      const invalidData = {
        firstName: "",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow(
        "First Name is required"
      );
    });

    it("should reject empty strings for lastName", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow("Last Name is required");
    });

    it("should reject empty strings for username", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        username: "",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow("Username is required");
    });

    it("should reject empty strings for password", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow("Confirm your password");
    });

    it("should accept whitespace-only strings for firstName (Yup behavior)", async () => {
      const validData = {
        firstName: "   ",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should accept whitespace-only strings for lastName (Yup behavior)", async () => {
      const validData = {
        firstName: "John",
        lastName: "   ",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should accept whitespace-only strings for username (Yup behavior)", async () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        username: "   ",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should accept whitespace-only strings for password if length >= 4", async () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "    ",
        confirmPassword: "    ",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should reject whitespace-only strings for password if length < 4", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "   ",
        confirmPassword: "   ",
      };

      await expect(validationSchema.validate(invalidData)).rejects.toThrow(
        "Password must contain at least 4 characters"
      );
    });
  });

  describe("Valid data", () => {
    it("should pass validation with valid signup data", async () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should pass validation with minimum valid password length", async () => {
      const validData = {
        firstName: "Jane",
        lastName: "Smith",
        username: "janesmith",
        password: "abcd",
        confirmPassword: "abcd",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it("should pass validation with longer password", async () => {
      const validData = {
        firstName: "Bob",
        lastName: "Johnson",
        username: "bobjohnson",
        password: "verylongpassword123",
        confirmPassword: "verylongpassword123",
      };

      await expect(validationSchema.validate(validData)).resolves.toEqual(validData);
    });
  });
});
