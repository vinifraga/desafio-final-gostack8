import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MdAddCircleOutline, MdChevronRight } from 'react-icons/md';
import { FaRegFrown, FaSpinner } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

import * as MeetupActions from '~/store/modules/meetup/actions';
import history from '~/services/history';

import { Container, ListHeader, List } from './styles';

export default function Dashboard() {
  const meetups = useSelector(state => state.meetup.meetups);
  const loading = useSelector(state => state.meetup.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MeetupActions.indexRequest());
  }, [dispatch]);

  return (
    <Container loading={loading ? 1 : 0}>
      <ListHeader>
        <h1>My meetups</h1>

        <button type="button" onClick={() => history.push('/new')}>
          <MdAddCircleOutline size={20} color="#FFF" />
          New meetup
        </button>
      </ListHeader>
      {loading ? (
        <div className="info">
          <FaSpinner size={40} color="rgba(255, 255, 255, 0.6)" />
          <span>Loading...</span>
        </div>
      ) : meetups.length > 0 ? (
        <List>
          {meetups.map(meetup => (
            <Link key={meetup.id} to={`details/${meetup.id}`}>
              <li>
                <strong>{meetup.title}</strong>
                <aside>
                  <time dateTime={meetup.date}>
                    {format(parseISO(meetup.date), 'MMMM do, yyyy, h a')}
                  </time>
                  <MdChevronRight size={24} color="#FFF" />
                </aside>
              </li>
            </Link>
          ))}
        </List>
      ) : (
        <div className="info">
          <FaRegFrown size={40} color="rgba(255, 255, 255, 0.6)" />
          <span>No meetups found</span>
        </div>
      )}
    </Container>
  );
}
