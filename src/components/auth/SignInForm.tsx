import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquareCode, KeyRound } from 'lucide-react';

const passwordFormSchema = z.object({
  phone: z.string().min(11).max(11),
  password: z.string().min(6),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy policy"
  })
});

const otpFormSchema = z.object({
  phone: z.string().min(11).max(11),
  otp: z.string().length(6),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy policy"
  })
});

interface SignInFormProps {
  onSubmit: (values: any) => void;
  countdown: number;
  onGetCode: () => void;
}

export const SignInForm = ({ onSubmit, countdown, onGetCode }: SignInFormProps) => {
  const { t } = useTranslation();
  const [loginType, setLoginType] = React.useState<'password' | 'otp'>('password');
  
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      phone: '',
      password: '',
      agreement: false
    }
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      phone: '',
      otp: '',
      agreement: false
    }
  });

  const isPhoneValid = loginType === 'password' 
    ? passwordForm.watch('phone')?.length === 11 
    : otpForm.watch('phone')?.length === 11;

  const handleSubmit = loginType === 'password' 
    ? passwordForm.handleSubmit(onSubmit) 
    : otpForm.handleSubmit(onSubmit);

  const currentForm = loginType === 'password' ? passwordForm : otpForm;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLoginType(loginType === 'password' ? 'otp' : 'password')}
          className="text-primary hover:text-primary/80"
        >
          {loginType === 'password' ? (
            <MessageSquareCode className="h-4 w-4 mr-2" />
          ) : (
            <KeyRound className="h-4 w-4 mr-2" />
          )}
          {loginType === 'password' ? t('useOtp') : t('usePassword')}
        </Button>
      </div>

      <Form {...currentForm}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={currentForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <Label>{t('phoneNumber')}</Label>
                <FormControl>
                  <Input placeholder="1xxxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginType === 'password' ? (
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label>{t('password')}</Label>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <Label>{t('verificationCode')}</Label>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button 
                      type="button" 
                      onClick={onGetCode} 
                      disabled={!isPhoneValid || countdown > 0}
                      variant="outline"
                      size="icon"
                      className="shrink-0 w-12 h-10 text-xs font-medium"
                    >
                      {countdown > 0 ? countdown : t('getCode')}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={currentForm.control}
            name="agreement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label>
                    {t('agreeToTerms')} <a href="/terms" className="text-primary hover:underline">{t('terms')}</a> {t('and')} <a href="/privacy" className="text-primary hover:underline">{t('privacy')}</a>
                  </Label>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t('signIn')}
          </Button>
        </form>
      </Form>
    </div>
  );
};