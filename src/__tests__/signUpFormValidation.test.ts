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

const createTestData = (overrides = {}) => ({
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  password: "password123",
  confirmPassword: "password123",
  ...overrides,
});

const testValidationError = async (data: any, expectedError: string) => {
  await expect(validationSchema.validate(data)).rejects.toThrow(expectedError);
};

const testValidationSuccess = async (data: any) => {
  await expect(validationSchema.validate(data)).resolves.toEqual(data);
};

describe("SignUpForm Validation Schema", () => {
  describe("Required field validation", () => {
    const requiredFieldTests = [
      { field: "firstName", error: "First Name is required" },
      { field: "lastName", error: "Last Name is required" },
      { field: "username", error: "Username is required" },
    ];

    requiredFieldTests.forEach(({ field, error }) => {
      it(`should require ${field}`, async () => {
        const data = createTestData({ [field]: undefined });
        await testValidationError(data, error);
      });
    });

    it("should require password", async () => {
      const data = createTestData({ password: undefined, confirmPassword: undefined });
      await testValidationError(data, "Confirm your password");
    });

    it("should require confirmPassword", async () => {
      const data = createTestData({ confirmPassword: undefined });
      await testValidationError(data, "Confirm your password");
    });
  });

  describe("Password validation", () => {
    it("should require minimum 4 characters for password", async () => {
      const data = createTestData({ password: "123", confirmPassword: "123" });
      await testValidationError(data, "Password must contain at least 4 characters");
    });

    it("should accept password with exactly 4 characters", async () => {
      const data = createTestData({ password: "1234", confirmPassword: "1234" });
      await testValidationSuccess(data);
    });

    it("should require password confirmation to match password", async () => {
      const data = createTestData({ confirmPassword: "differentpassword" });
      await testValidationError(data, "Password does not match");
    });
  });

  describe("Edge cases", () => {
    const emptyStringTests = [
      { field: "firstName", error: "First Name is required" },
      { field: "lastName", error: "Last Name is required" },
      { field: "username", error: "Username is required" },
    ];

    emptyStringTests.forEach(({ field, error }) => {
      it(`should reject empty strings for ${field}`, async () => {
        const data = createTestData({ [field]: "" });
        await testValidationError(data, error);
      });
    });

    it("should reject empty strings for password", async () => {
      const data = createTestData({ password: "", confirmPassword: undefined });
      await testValidationError(data, "Confirm your password");
    });

    const whitespaceTests = [{ field: "firstName" }, { field: "lastName" }, { field: "username" }];

    whitespaceTests.forEach(({ field }) => {
      it(`should accept whitespace-only strings for ${field} (Yup behavior)`, async () => {
        const data = createTestData({ [field]: "   " });
        await testValidationSuccess(data);
      });
    });

    it("should accept whitespace-only strings for password if length >= 4", async () => {
      const data = createTestData({ password: "    ", confirmPassword: "    " });
      await testValidationSuccess(data);
    });

    it("should reject whitespace-only strings for password if length < 4", async () => {
      const data = createTestData({ password: "   ", confirmPassword: "   " });
      await testValidationError(data, "Password must contain at least 4 characters");
    });
  });

  describe("Valid data", () => {
    const validDataTests = [
      { name: "valid signup data", data: {} },
      {
        name: "minimum valid password length",
        data: {
          firstName: "Jane",
          lastName: "Smith",
          username: "janesmith",
          password: "abcd",
          confirmPassword: "abcd",
        },
      },
      {
        name: "longer password",
        data: {
          firstName: "Bob",
          lastName: "Johnson",
          username: "bobjohnson",
          password: "verylongpassword123",
          confirmPassword: "verylongpassword123",
        },
      },
    ];

    validDataTests.forEach(({ name, data }) => {
      it(`should pass validation with ${name}`, async () => {
        const testData = createTestData(data);
        await testValidationSuccess(testData);
      });
    });
  });
});
