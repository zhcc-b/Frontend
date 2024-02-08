import * as Yup from 'yup';
import React, {useState} from 'react'
import {useFormik} from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {RouterLink} from 'src/components/router-link';
import {Seo} from 'src/components/seo';
import {GuestGuard} from 'src/guards/guest-guard';
import {IssuerGuard} from 'src/guards/issuer-guard';
import {useAuth} from 'src/hooks/use-auth';
import {useRouter} from 'src/hooks/use-router';
import {useSearchParams} from 'src/hooks/use-search-params';
import {Layout as AuthLayout} from 'src/layouts/auth/modern-layout';
import {paths} from 'src/paths';
import {Issuer} from 'src/utils/auth';
import sendHttpRequest from "../../../utils/send-http-request";

const initialValues = {
  email: '',
  name: '',
  password: '',
  confirm_password: '',
  policy: false,
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  name: Yup.string().max(255).required('Name is required'),
  password: Yup.string().min(8).max(255).required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  policy: Yup.boolean().oneOf([true], 'This field must be checked'),
});

const Page = () => {
  const [formError, setFormError] = useState({
    name: {error: false, message: ''},
    email: {error: false, message: ''},
    password: {error: false, message: ''},
  });

  function displayError(response) {

    const isUsernameError = response.data.username ?? false;
    const isEmailError = response.data.email ?? false;
    const isPasswordError = response.data.password ?? false;

    setFormError({
      ...formError,
      name: {
        error: isUsernameError,
        message: isUsernameError ? 'User already Exist!' : ''
      },
      email: {
        error: isEmailError,
        message: isEmailError ? "Email already registered! " : ''
      },
      password: {
        error: isPasswordError,
        message: isPasswordError ? response.data.password : ''
      }
    });
  }

  //const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { issuer, signUp } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // await signUp(values.email, values.name, values.password);
        //
        // if (isMounted()) {
        //   router.push(returnTo || paths.dashboard.index);
        // }

        await sendHttpRequest('http://localhost:8000/registration/register/', 'POST', {
          email: values.email,
          username: values.name,
          password: values.password
        }).then(
          response => {
            // const parsedResponse = JSON.parse(response.data);
            if (response.status === 201 || response.status === 200) {
              router.push(returnTo || paths.auth.jwt.login);
            } else if (response.status === 409 || response.status === 400) {
              displayError(response)
              helpers.setStatus({ success: false });
              helpers.setSubmitting(false);//暫定
            } else if (response.status === 500) {
              router.push('/500');
            }
          }
        )
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <>
      <Seo title="Register" />
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account? &nbsp;
                <Link
                  component={RouterLink}
                  href={paths.auth.jwt.login}
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            }
            sx={{ pb: 0 }}
            title="Register"
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name || formError.name.error)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name || formError.name.message}
                  label="Username"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email || formError.email.error)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email || formError.email.message}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password || formError.password.error)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password || formError.password.message}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={!!(formik.touched.confirm_password && formik.errors.confirm_password)}
                  fullWidth
                  helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                  label="Confirm Password"
                  name="confirmPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirmPassword}
                />
              </Stack>
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  ml: -1,
                  mt: 1,
                }}
              >
                <Checkbox
                  checked={formik.values.policy}
                  name="policy"
                  onChange={formik.handleChange}
                />
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  I have read the{' '}
                  <Link
                    component="a"
                    href="#"
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              </Box>
              {!!(formik.touched.policy && formik.errors.policy) && (
                <FormHelperText error>{formik.errors.policy}</FormHelperText>
              )}
              {formik.errors.submit && (
                <FormHelperText
                  error
                  sx={{ mt: 3 }}
                >
                  {typeof formik.errors.submit === 'string' ? formik.errors.submit : null}
                </FormHelperText>
              )}
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

Page.getLayout = (page) => (
  <IssuerGuard issuer={Issuer.JWT}>
    <GuestGuard>
      <AuthLayout>{page}</AuthLayout>
    </GuestGuard>
  </IssuerGuard>
);

export default Page;
