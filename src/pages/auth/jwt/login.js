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
import { useAuth } from 'src/hooks/use-auth';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { Layout as AuthLayout } from 'src/layouts/auth/modern-layout';
import { paths } from 'src/paths';
import { Issuer } from 'src/utils/auth';
import {IssuerGuard} from "../../../guards/issuer-guard";
import {GuestGuard} from "../../../guards/guest-guard";
import sendHttpRequest from "../../../utils/send-http-request";

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
  //const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { issuer, signIn } = useAuth();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // await signIn(values.email, values.password);
        //
        // if (isMounted()) {
        //   router.push(returnTo || paths.dashboard.index);
        // }
        await sendHttpRequest('http://localhost:8000/authentication/login/', 'POST', {
          username: values.name,
          password: values.password
        }).then(
          response => {
            const parsedResponse = JSON.parse(response.data);
            if (response.status === 200){
              localStorage.setItem('jwttoken', parsedResponse.access);
              router.push(returnTo || paths.dashboard.index);
            } else if (response.status === 404){
              console.error(parsedResponse.message);
              helpers.setStatus({ success: false });
              helpers.setErrors({ submit: 'wrong'});
              helpers.setSubmitting(false);
            }
          }
        )
      } catch (err) {
        console.error(err);

        // if (isMounted()) {
        //   helpers.setStatus({ success: false });
        //   helpers.setErrors({ submit: err.message });
        //   helpers.setSubmitting(false);
        // }
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
                  href={paths.auth.jwt.register}
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
                  autoFocus
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Username"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="username"
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
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
