import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { MdAddCircleOutline } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Container } from './styles';
import DateInput from './DateInput';
import BannerInput from './BannerInput';
import history from '~/services/history';
import * as MeetupActions from '~/store/modules/meetup/actions';

export default function Novo_Editar() {
  const params = useParams();
  const loading = useSelector(state => state.meetup.loading);
  const INITIAL_DATA = useSelector(
    state =>
      state.meetup.meetups.find(
        searchMeetup => searchMeetup.id === Number(params.id)
      ) || {}
  );
  const dispatch = useDispatch();
  const [, option] = useLocation().pathname.split('/');

  useEffect(() => {
    if (option === 'new') return;

    if (!params || !params.id || !INITIAL_DATA) {
      toast.error('Edit failed');
      history.push('/dashboard');
    }
  }, [INITIAL_DATA, option, params]);

  const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required'),
    banner_id: Yup.number().required('Banner is required'),
  });

  function handleSubmit(data) {
    if (option === 'new') {
      dispatch(MeetupActions.storeRequest(data));
    } else {
      const bannerId = INITIAL_DATA.banner.id;
      if (bannerId !== data.banner_id) {
        dispatch(MeetupActions.updateRequest(params.id, data, bannerId));
      } else {
        dispatch(MeetupActions.updateRequest(params.id, data));
      }
    }
  }
  return (
    <Container loading={loading ? 1 : 0}>
      <Form schema={schema} initialData={INITIAL_DATA} onSubmit={handleSubmit}>
        <BannerInput name="banner_id" />
        <Input name="title" type="text" placeholder="Meetup Title" />
        <Input
          multiline
          name="description"
          type="text"
          placeholder="Description"
        />
        <DateInput name="date" />
        <Input name="location" type="text" placeholder="Location" />
        <div className="button">
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner size={20} color="#FFF" />
                Saving...
              </>
            ) : (
              <>
                <MdAddCircleOutline size={20} color="#FFF" />
                Save meetup
              </>
            )}
          </button>
        </div>
      </Form>
    </Container>
  );
}
