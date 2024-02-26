import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { Layout as AuthLayout } from 'src/layouts/auth/modern-layout';
import { paths } from 'src/paths';
import { Issuer } from 'src/utils/auth';
import {IssuerGuard} from "src/guards/issuer-guard";
import {GuestGuard} from "src/guards/guest-guard";
import sendHttpRequest from "src/utils/send-http-request";
import {useState} from "react";

const initialValues = {
  username: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  username: Yup.string().max(255).required('Username is required'),
  password: Yup.string().max(255).required('Password is required'),
});

const Page = () => {
  const [formError, setFormError] = useState({
    username: {error: false, message: ''},
    password: {error: false, message: ''},
    detail: {error: false, message: ''},
  });

  function displayError(response) {

    const isUsernameError = response.data.username ?? false;
    const isPasswordError = response.data.password ?? false;
    const isDetailError = response.data.detail ?? false;

    setFormError({
      ...formError,
      username: {
        error: isUsernameError,
        message: isUsernameError ? response.data.username : ''
      },
      password: {
        error: isPasswordError,
        message: isPasswordError ? response.data.password : ''
      },
      detail: {
        error: isDetailError,
        message: isDetailError ? 'Incorrect username or password!' : ''
      },
    });
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {

        localStorage.removeItem('jwttoken');

        await sendHttpRequest('http://localhost:8000/accounts/login/', 'POST', {
          username: values.username,
          password: values.password
        }).then(
          response => {
            // const parsedResponse = JSON.parse(response.data);
            if (response.status === 200){
              localStorage.setItem('jwttoken', response.data.access);
              router.push(returnTo || paths.dashboard.index);
            } else if (response.status === 500){
              router.push('/500');
            } else if (response.status === 400 || response.status === 401){
              displayError(response)
              helpers.setStatus({ success: false });
              helpers.setSubmitting(false);
            }
          }
        )
      } catch (err) {
        console.error(err);
      }
    },
  });

  usePageView();

  return (
    <>
      <Seo title="Login" />
      <div>
        <Card elevation={16}>
          <CardHeader
            subheader={
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account? &nbsp;
                <Link
                  component={RouterLink}
                  href={paths.register}
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            }
            sx={{ pb: 0 }}
            title="Log in"
          />
          <CardContent>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.username && formik.errors.username || formError.username.error)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username || formError.username.message}
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="username"
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password || formError.password.error || formError.detail.error)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password || formError.password.message || formError.detail.message}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
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
                Log In
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
