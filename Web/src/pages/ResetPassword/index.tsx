/* eslint-disable camelcase */
import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/toast';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface ResetPasswordFormData {
    password: string;
    // eslint-disable-next-line camelcase
    password_confirmation: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast();

    const history = useHistory();
    const location = useLocation();

    const handleSubmit = useCallback(
        async (data: ResetPasswordFormData) => {
            try {
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    password: Yup.string().required('Senha obrigatória'),
                    password_confirmation: Yup.string().oneOf(
                        [Yup.ref('password'), null],
                        'Confirmação incorreta',
                    ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const { password, password_confirmation } = data;
                const token = location.search.replace('?token=', '');

                if (!token) {
                    throw new Error();
                }

                await api.post('/password/reset', {
                    password,
                    password_confirmation,
                    token,
                });

                history.push('/');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    console.log(err);

                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'info',
                    title: 'Erro ao resetar senha',
                    description:
                        'Ocorreu um erro ao resetar sua senha, tente novamente.',
                });
            }
        },
        [addToast, history, location.search],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Resetar Senha</h1>

                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Senha"
                        />
                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            type="password"
                            placeholder="Confirmação da senha"
                        />
                        <Button type="submit">Alterar seha</Button>
                    </Form>
                </AnimationContainer>
            </Content>

            <Background />
        </Container>
    );
};

export default SignIn;
